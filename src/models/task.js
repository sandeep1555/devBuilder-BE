const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    is_active: {
        type: Boolean,
        default: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    unit: {
        type: String,
        required: true,
    },
    max_progress: {
        type: Number,
        required: true,
    },
    progress:
    {
        type: Number,
        default: 0

    },
    category: {
        type: Number,
        required: true,
        ref: 'Category',
    },
    tag: {
        type: Number,
        required: true,
        ref: 'Tag',
    },
    project: {
        type: Number,
        required: true,
        ref: 'Project',  // Reference to the Project model
    },
    start_date: {
        type: Date,
        required: true,
    },
    end_date: {
        type: Date,
        required: true,
    },
    id: {
        type: Number,
        unique: true,

    },
    orderId: {
        type: Number,
    },
    latest_comment: {
        type: String,
        default: ""

    }
}, {
    timestamps: true,
});


taskSchema.pre("save", async function (next) {
    if (!this.isNew) return next(); // Only increment for new documents

    const lastTask = await Task.findOne().sort({ id: -1 });
    this.id = lastTask ? lastTask.id + 1 : 1; // Increment if exists, else start at 1

    const lastTaskOrder = await Task.findOne().sort({ orderId: -1 });
    this.orderId = lastTaskOrder ? lastTaskOrder.orderId + 1 : 1; // Increment if exists, else start at 1
    next();
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
