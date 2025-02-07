
const express = require("express")
const authRouter = express.Router();
const { validateSignUpFeild, validateLoginFeild, ROLE_OWN_PERMISSIONS, ROLE_PROJECT_MANAGER_PERMISSIONS, ROLE_PROJECT_SUPERVISOR_PERMISSIONS } = require("../utils/validation");
const bcrypt = require("bcrypt")
const User = require("../models/user");


authRouter.post("/signup", async (req, res) => {

    try {
        const { password, firstName, lastName, emailId, group } = req.body
        //validate the body
        validateSignUpFeild(req.body)
        //create hash
        const hashPassword = await bcrypt.hash(password, 10)

        let userPermission = [];
        if (group === "ROLE_OWN") {
            userPermission = ROLE_OWN_PERMISSIONS;
        } else if (group === "ROLE_PROJECT_MANAGER") {
            userPermission = ROLE_PROJECT_MANAGER_PERMISSIONS;
        } else if (group === "ROLE_PROJECT_SUPERVISOR") {
            userPermission = ROLE_PROJECT_SUPERVISOR_PERMISSIONS;
        } else {
            throw new Error("Invalid group provided");
        }

        const user = new User({
            firstName, lastName, emailId, password: hashPassword, group, userPermission
        })
        const savedUser = await user.save();
        const tokenExpireTime = '8h'; // Set token expiry time
        const refreshTokenExpireTime = '30d'; // Set refresh token expiry time


        const token = await savedUser.getJWT();

        res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });


        res.json({
            message: 'user added Successfully',
            access_token: token,
            token_expire_time: tokenExpireTime,
            refresh_token_expire_time: refreshTokenExpireTime,
            role: savedUser.group,
            data: savedUser
        });


    }
    catch (err) {
        res.status(401).json({ errors: err.message })
    }
})

authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        validateLoginFeild(req.body)
        const user = await User.findOne({ emailId });

        if (!user) {
            throw new Error('Invalid Credentials');
        }

        const isValidPassword = await user.verifyPassword(password);
        if (!isValidPassword) {
            throw new Error('Invalid Credentials');
        }

        const token = await user.getJWT();
        const tokenExpireTime = '8h'; // Set token expiry time
        const refreshTokenExpireTime = '30d'; // Set refresh token expiry time
        const role = user.group; // Assuming user role is stored in user model
        res.cookie('token', token, { expires: new Date(Date.now() + 8 * 3600000) }); // Token expiry set to 8 hours

        res.send({
            message: 'Login Successfully',
            access_token: token,
            token_expire_time: tokenExpireTime,
            refresh_token_expire_time: refreshTokenExpireTime,
            role: role,
            data: user,
        });
    } catch (err) {
        res.status(401).json({ errors: err.message })
    }
});


authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()), httpOnly: true,
        secure: process.env.NODE_ENV === "production", sameSite: 'None'
    });
    res.send("logout successful");
})


authRouter.put("/update/profile/:userId", async (req, res) => {
    try {
        const { firstName, lastName } = req.body;
        const { userId } = req.params;
        const userEdit = await User.findOneAndUpdate({ _id: userId }, { firstName: firstName, lastName: lastName }, { new: true })
        res.status(200).json({ message: "User details updated successfully", data: userEdit })
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }

})

module.exports = authRouter