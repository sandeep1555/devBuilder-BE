const express = require('express');
const organisationRouter = express.Router();
const Organisation = require('../models/organisation'); // Adjust the path as necessary
const { userAuth } = require('../middleware/userAuth');

// Create a new organisation
organisationRouter.post('/organisation/create', userAuth, async (req, res) => {
    try {
        const { name, organisation_type, address1, city, state, country, zip, logo } = req.body;

        // Validate required fields
        if (!name || !organisation_type || !address1 || !city || !state || !country || !zip) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }

        const newOrganisation = new Organisation({
            name,
            organisation_type,
            address1,
            city,
            state,
            country,
            zip,
            logo
        });

        const savedOrganisation = await newOrganisation.save();

        res.status(201).json({ message: 'Organisation created successfully', data: savedOrganisation });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

organisationRouter.put('/organisation/update/:id', userAuth, async (req, res) => {
    try {
        const organisationId = req.params.id;
        const {
            name,
            organisation_type,
            phone,
            address1,
            address2,
            city,
            logo,
            state,
            country,
            zip,
            balance
        } = req.body;

        // Find the organisation by ID and update it with new data
        const updatedOrganisation = await Organisation.findByIdAndUpdate(
            organisationId,
            {
                name,
                organisation_type,
                phone,
                address1,
                address2,
                city,
                logo,
                state,
                country,
                zip,
                balance,
            },
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedOrganisation) {
            return res.status(404).json({ message: 'Organisation not found' });
        }

        res.json({ message: 'Organisation updated successfully', data: updatedOrganisation });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


organisationRouter.get('/organisation/detail', userAuth, async (req, res) => {
    try {
        const organisations = await Organisation.find();
        res.status(200).json(organisations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = organisationRouter;
