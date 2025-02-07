const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    id: { type: Number, unique: true },  // Unique and auto-incremented field
    name: { type: String, required: true }
});

// Pre-save hook to increment the id
tagSchema.pre('save', async function (next) {
    if (!this.isNew) return next();

    const lastTag = await Tag.findOne().sort({ id: -1 }); // Get the last tag
    this.id = lastTag ? lastTag.id + 1 : 1; // Increment id or start at 1
    next();
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
