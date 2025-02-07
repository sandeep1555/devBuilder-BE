require('dotenv').config();
const User = require("../models/user")
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies
        if (!token) {
            return res.status(401).send("please login!")
        }
        const decodedObj = jwt.verify(token, process.env.JWT_SECRET)
        const { _id } = decodedObj
        const isUser = await User.findById(_id)
        if (!isUser) {
            throw new Error("User Not Found ")
        }
        req.user = isUser;
        next()
    }
    catch (error) {
        res.status(400).send(error.message)
    }
}

module.exports = { userAuth }   