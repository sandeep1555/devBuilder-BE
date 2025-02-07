const mongoose = require("mongoose");

const remarkSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  description: {
    type: String,  // Use String instead of Text for Mongoose
    required: true,
  },
  author: {
    type: String,  // Use String instead of Text for Mongoose
    required: true,
  },
  added_at: {
    type: Date,
    default: Date.now,  // Automatically set the current time when a remark is created
  },
  taskId: {
    type: Number,
    require: true
  }
});

remarkSchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  const lastRemark = await Remark.findOne().sort({ id: -1 }); // Get the last remark
  this.id = lastRemark ? lastRemark.id + 1 : 1; // Increment id or start at 1
  next();
});

const Remark = mongoose.model("Remark", remarkSchema);
module.exports = Remark;
