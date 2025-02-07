
const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/userAuth");


profileRouter.get("/account/detail", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send({
            message: "User profile is,",
            data: user
        })

    }
    catch (err) {
        res.status(404).send("something went wrong " + err.message)
    }
})

module.exports = profileRouter;