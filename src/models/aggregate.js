const mongoose = require('mongoose');

const AggregateListSchema = new mongoose.Schema({
    name: { type: String, required: true },
    average_progress_percentage: { type: Number, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    count: { type: Number, required: true },
    completed_task: { type: Number, required: true },
    max_priority: { type: Number, required: true },
    id: { type: Number, unique: true },
    orderId: { type: Number }
});


AggregateListSchema.pre("save", async function (next) {
    if (!this.isNew) return next(); // Only increment for new documents

    const lastAggreateTask = await AggregateList.findOne().sort({ id: -1 });
    this.id = lastAggreateTask ? lastTask.id + 1 : 1; // Increment if exists, else start at 1

    const lastTaskOrder = await AggregateList.findOne().sort({ orderId: -1 });
    this.orderId = lastTaskOrder ? lastTaskOrder.orderId + 1 : 1; // Increment if exists, else start at 1
    next();
});

const AggregateList = mongoose.model('AggregateList', AggregateListSchema);

module.exports = AggregateList
