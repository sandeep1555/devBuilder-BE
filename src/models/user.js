require('dotenv').config();
const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { ROLE_OWN_PERMISSIONS } = require("../utils/validation")
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 40
    },
    lastName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 40
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("invalid emailId" + value)
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    group: {
        type: String,
        required: true,
        enum: ['ROLE_OWN', 'ROLE_PROJECT_MANAGER', 'ROLE_PROJECT_SUPERVISOR'],


    },
    userPermission: {
        type: [String],
        require: true
    }

}, {
    timestamps: true
})


userSchema.pre('save', function (next) {
    const user = this;

    if (user.group === 'ROLE_OWN') {
        user.userPermission = ROLE_OWN_PERMISSIONS;
    }

    next();
});

userSchema.methods.verifyPassword = async function (password) {
    const user = this
    const isValidPassword = await bcrypt.compare(password, user.password)

    return isValidPassword
}
userSchema.methods.getJWT = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return token;
}
const User = mongoose.model("User", userSchema)

module.exports = User