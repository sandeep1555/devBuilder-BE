const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    id: { type: Number, unique: true },  // Unique and auto-incremented field
    name: { type: String, required: true }
});

// Pre-save hook to increment the id
categorySchema.pre('save', async function (next) {
    if (!this.isNew) return next();

    const lastCategory = await Category.findOne().sort({ id: -1 }); // Get the last category
    this.id = lastCategory ? lastCategory.id + 1 : 1; // Increment id or start at 1
    next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
