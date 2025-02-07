const mongoose = require("mongoose");

// Define the schema
const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: [2, "Name must be at least 2 characters long"],
        maxLength: 100
    },
    projectId: {
        type: Number,
        unique: true,
        min: 1,
        max: 100
    },
    organisationId: {
        type: Number,
        unique: true,
    },
    taskCount: {
        type: Number,
    },
    bgColor: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

// Pre-save hook to auto-increment projectId
projectSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastProject = await Project.findOne().sort({ projectId: -1 });
        if (lastProject && lastProject.projectId < 100) {
            this.projectId = lastProject.projectId + 1;
        } else if (!lastProject) {
            this.projectId = 1;
        } else {
            return next(new Error("Maximum projectId limit reached (100)"));
        }
    }
    next();
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
