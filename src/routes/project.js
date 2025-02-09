const express = require("express");
const projectRouter = express.Router();
const Project = require("../models/project"); // Adjust the path accordingly
const { userAuth } = require("../middleware/userAuth");
const { getRandomLightColor } = require("../utils/validation");
const Task = require("../models/task");

// Route to get all projects
projectRouter.get("/project/list/:organisationId", userAuth, async (req, res) => {
    try {
        const { organisationId } = req.params;
        const projects = await Project.find({ organisationId: organisationId });

        await Promise.all(
            projects.map(async (project) => {
                const taskCount = await Task.countDocuments({ "project": project.projectId });
                await Project.findOneAndUpdate({ projectId: project.projectId }, { taskCount: taskCount });

            })
        );



        res.json({ message: "Project list retrieved successfully", data: projects, });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to create a new project
projectRouter.post("/project/create/:organisationId", userAuth, async (req, res) => {
    try {
        const { organisationId } = req.params;

        const { name, bgColor } = req.body;
        const { firstName, lastName } = req.user;
        const creatorName = firstName + " " + lastName;
        // Check if projectName is provided
        if (!name) {
            return res.status(400).json({ error: "Project name is required" });
        }

        const newProject = new Project({ name, organisationId: organisationId, bgColor: bgColor, createdBy: creatorName });
        const savedProject = await newProject.save();

        res.status(200).json({ message: "Project created successfully", data: savedProject });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ error: messages.join(", ") });
        }
        res.status(500).json({ error: err.message });
    }
});

projectRouter.put("/project/update/:projectId", userAuth, async (req, res) => {
    try {
        const { projectId } = req.params;
        const { name, bgColor } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Project name is required" });
        }
        const editProject = await Project.findOneAndUpdate({ projectId: projectId }, { name: name, bgColor: bgColor }, { new: true });
        res.status(200).json({ message: "Project updated successfully", data: editProject });

    }
    catch (err) {
        res.status(500).json({ error: err.message });

    }

})



projectRouter.delete("/project/delete/:projectId", userAuth, async (req, res) => {
    try {
        const { projectId } = req.params;
        const deletedProject = await Project.findOneAndDelete({ projectId: projectId });
        res.status(200).json({ message: "project deleted successfully", data: deletedProject })
    }
    catch (err) {
        res.status(500).json({ error: err.message });

    }

})


module.exports = projectRouter;


