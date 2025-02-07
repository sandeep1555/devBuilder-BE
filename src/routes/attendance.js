const express = require("express")
const { userAuth } = require("../middleware/userAuth");
const Attendance = require("../models/attendance");

const attendanceRouter = express.Router()

attendanceRouter.post("/contractor/:contractorId/attendance", userAuth, async (req, res) => {
    try {
        const { contractorId } = req.params;
        const { project, date, labour_count } = req.body;
        const saveAttendance = new Attendance({ projectId: project, date: date, labour_count: labour_count, contractorId: contractorId });
        const savedAttendance = await saveAttendance.save()
        res.status(200).json({ message: "Attendance created Successfully", data: savedAttendance })
    }
    catch (err) {
        res.status(500).json({ error: err.messsage })
    }

})

attendanceRouter.get("/contractor/:contractorId/attendance/:projectId", userAuth, async (req, res) => {
    try {
        const { contractorId, projectId } = req.params;
        const attendanceList = await Attendance.find({ contractorId: contractorId, projectId: projectId });
        res.status(200).json({ message: "Attendance list got successfully", data: attendanceList })
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
})

attendanceRouter.put("/contractor/:contractorId/attendance/:attendanceId", userAuth, async (req, res) => {
    try {
        const { contractorId, attendanceId } = req.params;
        const { project, date, labour_count } = req.body;

        const updateAttendance = await Attendance.findOneAndUpdate({ id: attendanceId }, { projectId: project, date: date, labour_count: labour_count }, { new: true });

        res.status(200).json({ message: "Attendance updated successfully", data: updateAttendance })


    }
    catch (err) {
        res.status(500).json({ error: err.message })

    }
})

attendanceRouter.delete("/contractor/:contractorId/attendance/:attendanceId", userAuth, async (req, res) => {
    try {
        const { contractorId, attendanceId } = req.params;

        const deletedAttendance = await Attendance.findOneAndDelete({ id: attendanceId })
        res.status(200).json({ message: "Attendance deleted successfully", data: deletedAttendance })

    }
    catch (err) {
        res.status(500).json({ error: err.message })

    }



})
module.exports = attendanceRouter