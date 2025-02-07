require('dotenv').config
const mongoose = require("mongoose")
const connectDB = async () => {
    await mongoose.connect("mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@erp.qaa0v.mongodb.net/")
}

module.exports = connectDB