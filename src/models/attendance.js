const mongoose = require("mongoose")

const attendanceSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
    },
    labour_count: {
        type: Number,
        require: true,
    },
    date: {
        type: Date,
        require: true,
    },
    projectId: {
        type: Number,
        require: true
    },
    contractorId: {
        type: Number,
        require: true
    }
})

attendanceSchema.pre('save', async function (next) {
    if (!this.isNew) return next();

    const lastAttendance = await Attendance.findOne().sort({ id: -1 }); // Get the last category
    this.id = lastAttendance ? lastAttendance.id + 1 : 1; // Increment id or start at 1
    next();
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance