const express = require("express");
const authRouter = require("./auth");
const { userAuth } = require("../middleware/userAuth");
const Remark = require("../models/Remark");
const Task = require("../models/task");
const remarkRouter = express.Router();



remarkRouter.post("/task/:taskId/remarks", userAuth, async (req, res) => {
    try {
        const { taskId } = req.params
        const user = req.user;
        const { firstName, lastName } = user;
        const author = firstName + " " + lastName;
        const { description } = req.body;
        const newRemark = new Remark({ description, author, taskId });
        const remark = await newRemark.save();
        const latestComment = await Remark.find({ taskId: taskId }).sort({ added_at: -1 }).limit(1);
        const latestdescription = latestComment[0].description;

        const task = await Task.findOneAndUpdate({ id: taskId }, { latest_comment: latestdescription });
        res.status(200).json({ message: "comment created Successfully", data: remark })
    }

    catch (err) {
        res.status(500).json({ error: err.message });
    }

})

remarkRouter.get("/task/:taskId/remarks", userAuth, async (req, res) => {
    try {
        const { taskId } = req.params
        const remarks = await Remark.find({ taskId: taskId }).sort({added_at: -1 })  // Sort by latest first
        .limit(20); // Only get the most recent remark;
        res.status(200).json({ message: "comment list Successfully", data: remarks })
    }


    catch (err) {
        res.status(500).json({ error: err.message });
    }
})

remarkRouter.put("/task/:taskId/remarks/:commentId", userAuth, async (req, res) => {
    try {
        const { description } = req.body
        const user = req.user;
        const { firstName, lastName } = user;
        const author = firstName + " " + lastName;
        const { taskId, commentId } = req.params;
        const updateRemark = await Remark.findOneAndUpdate({ id: commentId, taskId }, { description, author, taskId }, { new: true });

        if (!updateRemark) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Remark updated successfully", data: updateRemark });

    }
    catch (err) {
        res.status(500).json({ error: err.message });

    }
})



remarkRouter.delete("/task/:taskId/remarks/:commentId", userAuth, async (req, res) => {
    try {
        const { taskId, commentId } = req.params;
        const deletedRemark = await Remark.findOneAndDelete({ id: commentId, taskId });
        if (!deletedRemark) {
            return res.status(404).json({ message: "Remark not found" });
        }
        res.status(200).json({ message: "Remark deleted successfully", deletedRemark });

    }
    catch (error) {
        console.error("Error deleting remark:", error);
        res.status(500).json({ message: "An error occurred while deleting the remark" });
    }
})




module.exports = remarkRouter