const mongoose = require('mongoose');

const organisationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 256
    },
    organisation_type: {
        type: Number,
        required: true,
        enum: [1, 2] // Assuming 1 for 'CONSTRUCTION' and 2 for 'GOVERNMENT CONTRACTORS'
    },
    phone: {
        type: String,
        maxlength: 15,
        required: false
    },
    is_phone_verified: {
        type: Boolean,
        default: false
    },
    logo: {
        type: String, // Store file path or URL
        required: false
    },
    address1: {
        type: String,
        required: true,
        maxlength: 256
    },
    address2: {
        type: String,
        required: false,
        maxlength: 256
    },
    city: {
        type: String,
        required: true,
        maxlength: 128
    },
    state: {
        type: String,
        required: true,
        maxlength: 128
    },
    country: {
        type: String,
        required: true,
        maxlength: 128
    },
    zip: {
        type: String,
        required: true,
        maxlength: 64
    },
    id: {
        type: Number,
        unique: true

    }
}, { timestamps: true });

organisationSchema.pre('save', async function (next) {
    if (!this.isNew) return next();

    const lastOrganisation = await Organisation.findOne().sort({ id: -1 }); // Get the last category
    this.id = lastOrganisation ? lastOrganisation.id + 1 : 1; // Increment id or start at 1
    next();
});
const Organisation = mongoose.model('Organisation', organisationSchema);

module.exports = Organisation;
