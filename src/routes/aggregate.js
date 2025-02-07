const express = require('express');
const aggregateRouter = express.Router();
const Task = require('../models/task')
const AggregateList = require("../models/aggregate");
const { userAuth } = require('../middleware/userAuth');

function aggregateTasks(tasks) {
    const aggregateMap = new Map();

    tasks.forEach(task => {
        const { name, progress, max_progress, start_date, end_date, orderId, id } = task;
        if (!aggregateMap.has(name)) {
            aggregateMap.set(name, {
                name,
                total_progress: 0,
                max_progress_total: 0,
                start_date: new Date(start_date),
                end_date: new Date(end_date),
                count: 0,
                completed_task: 0,
                max_priority: 1, // Default priority
                orderId: orderId,
                id: id

            });
        }

        const aggregate = aggregateMap.get(name);
        aggregate.total_progress += progress || 0;
        aggregate.max_progress_total += max_progress || 0;
        aggregate.start_date = new Date(Math.min(aggregate.start_date, new Date(start_date)));
        aggregate.end_date = new Date(Math.max(aggregate.end_date, new Date(end_date)));
        aggregate.count += 1;
        aggregate.orderId = orderId;
        aggregate.id = id;
        if (progress === max_progress) {
            aggregate.completed_task += 1;
        }
    });

    return Array.from(aggregateMap.values()).map(aggregate => ({
        name: aggregate.name,
        average_progress_percentage: Math.round((aggregate.total_progress / aggregate.max_progress_total) * 100),
        start_date: aggregate.start_date,
        end_date: aggregate.end_date,
        count: aggregate.count,
        completed_task: aggregate.completed_task,
        max_priority: aggregate.max_priority,
        orderId: aggregate.orderId,
        id: aggregate.id
    }));
}

// Route to get aggregated list
aggregateRouter.get('/task/:projectId/aggregate/list', userAuth, async (req, res) => {
    try {
        const { projectId } = req.params;

        const tasks = await Task.find({ 'project': projectId })
        const aggregatedData = aggregateTasks(tasks);
        aggregatedData.sort((a, b) => a.orderId - b.orderId);
        // await AggregateList.insertMany(aggregatedData);
        res.json({ message: 'Aggregated tasks retrieved successfully', data: aggregatedData });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving aggregated tasks', error });
    }
});


module.exports = aggregateRouter;
