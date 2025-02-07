const express = require('express');
const Tag = require('../models/tag'); // Adjust the path to your Tag model
const { userAuth } = require('../middleware/userAuth');
const tagRouter = express.Router();

// Route to get all tags with optional search query
tagRouter.get('/tag/list', userAuth, async (req, res) => {
    try {

        const searchQuery = req.query.search || '';
        // Use regex for case-insensitive search
        const tags = await Tag.find({
            name: { $regex: searchQuery, $options: 'i' }
        }).sort({ name: 1 }); // Sort alphabetically by name

        res.json({ message: 'Tags retrieved successfully', data: tags });
    } catch (err) {

        res.status(500).json({ error: err.message });
    }
});

// Route to create a new tag
tagRouter.post('/tag/create', userAuth, async (req, res) => {
    try {
        const { name } = req.body;
        const tag = new Tag({ name });
        const savedTag = await tag.save();
        res.status(200).json({ message: "Tag created successfully", data: savedTag });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = tagRouter;
