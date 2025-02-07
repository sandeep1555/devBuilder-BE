const express = require("express");
const Taskrouter = express.Router();
const mongoose = require("mongoose");
const Task = require("../models/task"); // Adjust the path to the task model
const { userAuth } = require("../middleware/userAuth");
const Category = require("../models/category");
const Remark = require("../models/Remark");



// Route to create a new task
Taskrouter.post("/task/create", userAuth, async (req, res) => {
    try {
        const latest_comment = "";
        const { is_active, name, description, unit, max_progress, category, tag, project, start_date, end_date } = req.body;

        // Basic validation (optional, depending on your needs)
        if (!name || !unit || !max_progress || !category || !tag || !project || !start_date || !end_date) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newTask = new Task({
            is_active,
            name,
            description,
            unit,
            max_progress,
            category,
            tag,
            project,
            start_date,
            end_date,
            latest_comment
        });

        const savedTask = await newTask.save();

        res.status(200).json({ message: "Task created successfully", data: savedTask });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



Taskrouter.get('/task/:projectId/list', userAuth, async (req, res) => {
    try {
        const { projectId } = req.params;
        const { search = '', name = '', category__name = '' } = req.query;

        // Build the query object
        const query = { project: Number(projectId) };

        // Filter by search query (e.g., partial match for task name)
        if (search) {
            query.name = { $regex: search, $options: 'i' }; // Case-insensitive partial match
        }

        // Filter by exact task name
        if (name) {
            query.name = name; // Exact match
        }

        // Filter by exact category name
        if (category__name) {
            const category = await Category.findOne({ name: category__name });
            if (category) {
                query.category = category.id; // Use the category's ID to filter tasks
            }
        }

        // Fetch tasks with the query
        const tasks = await Task.find(query)
            .populate({
                path: 'project',
                model: 'Project',
                localField: 'project',
                foreignField: 'projectId',
                select: 'id name', // Select specific project fields
            })
            .populate({
                path: 'category',
                model: 'Category',
                foreignField: 'id',
                select: 'id name', // Select specific category fields
            })
            .populate({
                path: 'tag',
                model: 'Tag',
                foreignField: 'id',
                select: 'id name', // Select specific tag fields
            })
            .sort({ orderId: 1, name: 1 })


        res.json({ message: 'Tasks retrieved successfully', data: tasks });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});





Taskrouter.delete("/task/delete/:id", userAuth, async (req, res) => {
    try {
        const taskId = req.params.id;

        // Find the task by ID and delete it
        const deletedTask = await Task.findOneAndDelete({ id: taskId });

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task deleted successfully", data: deletedTask });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


Taskrouter.put("/task/update/:id", userAuth, async (req, res) => {
    try {
        const taskId = req.params.id;
        const latestComment = await Remark.find({ taskId: taskId }).sort({ added_at: -1 }).limit(1);
        const {
            name,
            description,
            unit,
            max_progress,
            progress,
            category,
            tag,
            project,
            start_date,
            end_date,
        } = req.body;

        // Find the task by ID and update it with new data
        const updatedTask = await Task.findOneAndUpdate({ id: taskId },
            {
                name,
                description,
                unit,
                max_progress,
                progress,
                category,
                tag,
                project,
                start_date,
                end_date,
                latestComment,
            },
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task updated successfully", data: updatedTask });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


Taskrouter.get('/task/unit', userAuth, async (req, res) => {
    const unitOptions = [
        { display_name: 'percentage', value: '%' },
        { display_name: 'meter', value: 'm' },
        { display_name: 'kilometer', value: 'km' }
    ];
    res.json(unitOptions);
});

Taskrouter.patch("/task/update/:taskId/", userAuth, async (req, res) => {
    try {
        const { taskId } = req.params;
        const { progress } = req.body;

        const updateProgress = await Task.findOneAndUpdate({ id: taskId }, { progress: progress }, { save: true })
        res.status(200).json({ message: "progress updated successfully", data: updateProgress });

    }
    catch (err) {
        res.status(500).json({ error: err.message });

    }

})



Taskrouter.post("/tasks/order", userAuth, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction(); // Start transaction

    try {
        const { tasks } = req.body; // [{ id, orderId }]

        // Step 1: Temporarily remove orderId (to avoid unique constraint errors)
        await Task.updateMany({}, { $inc: { orderId: 1010 } }, { session });

        // Step 2: Assign new orderId values
        for (const task of tasks) {
            await Task.findOneAndUpdate(
                { id: task.id }, // Find task by ID
                { orderId: task.orderId }, // Assign new orderId
                { new: true, session } // Use session to maintain transaction
            );
        }

        await session.commitTransaction(); // Commit transaction
        session.endSession();
        res.json({ message: "Task order updated successfully" });

    } catch (err) {
        await session.abortTransaction(); // Rollback on error
        session.endSession();
        res.status(500).json({ error: err.message });
    }
});



module.exports = Taskrouter;
