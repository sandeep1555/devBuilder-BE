const express = require("express");
const { userAuth } = require("../middleware/userAuth");
const Contractor = require("../models/contractor");
const contractorRouter = express.Router()

contractorRouter.post("/contractor/:projectId", userAuth, async (req, res) => {


    try {
        const { projectId } = req.params;
        const { name } = req.body;
        const contractor = new Contractor({ name, projectId: projectId });
        const saveContractor = await contractor.save();
        res.status(200).json({ message: "contractor created successfully", data: saveContractor });

    }
    catch (err) {
        res.status(500).json({ error: err.messsage })

    }
})

contractorRouter.get("/contractor/:projectId", userAuth, async (req, res) => {
    try {
        const { projectId } = req.params;
        const contractorList = await Contractor.find({ projectId: projectId });
        res.status(200).json({ message: "contractor list got successfully", data: contractorList })
    }
    catch (err) {
        res.status(500).json({ error: err.messsage })

    }
})

contractorRouter.put("/contractor/:contractorId", userAuth, async (req, res) => {
    try {
        const { contractorId } = req.params;
        const { name } = req.body
        const updateContractor = await Contractor.findOneAndUpdate({ id: contractorId }, { name: name }, { new: true });
        res.status(200).json({ message: "Contractor Updated successfully", data: updateContractor });

    }
    catch (err) {
        res.status(500).json({ error: err.messsage })

    }
})

contractorRouter.delete("/contractor/:contractorId", userAuth, async (req, res) => {
    try {
        const { contractorId } = req.params;
        const deletedContractor = await Contractor.findOneAndDelete({ id: contractorId });
        res.status(200).json({ message: "contractor deleted successfully", data: deletedContractor });
    }
    catch (err) {
        res.status(500).json({ error: err.messsage })
    }
})




module.exports = contractorRouter