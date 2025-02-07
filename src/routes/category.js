const express = require('express');
const Category = require('../models/category'); // Adjust the path to your Category model
const { userAuth } = require('../middleware/userAuth');
const categoryRouter = express.Router();

// Route to get all categories with optional search query
categoryRouter.get('/category/list/', userAuth, async (req, res) => {
    try {
        const searchQuery = req.query.search || '';

        // Use regex for case-insensitive search
        const categories = await Category.find({
            name: { $regex: searchQuery, $options: 'i' }
        }).sort({ name: 1 }); // Sort alphabetically by name

        res.json({ message: 'Categories retrieved successfully', data: categories });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

categoryRouter.post('/category/create/', userAuth, async (req, res) => {
    try {
        const { name } = req.body;
        const category = new Category({ name });
        const savedCategory = await category.save();
        res.status(200).json({ message: "category created successfully", data: savedCategory });

    }
    catch (err) {
        res.status(500).json({ error: err.messsage })
    }
})

module.exports = categoryRouter;
