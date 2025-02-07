const mongoose = require("mongoose")

const contractorSchema = new mongoose.Schema({

    id: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        require: true
    },
    projectId: {
        type: Number,
        require: true
    }

})

contractorSchema.pre('save', async function (next) {
    if (!this.isNew) return next();

    const lastContractor = await Contractor.findOne().sort({ id: -1 }); // Get the last category
    this.id = lastContractor ? lastContractor.id + 1 : 1; // Increment id or start at 1
    next();
});

const Contractor = mongoose.model("Contractor", contractorSchema);

module.exports = Contractor