const mongoose = require("mongoose");
const subTaskModel = require("./subTaskModel");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: {
    type: Date,
    default: () => {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 15); // Setting dueDate to 15 minutes later from now
      return now;
    },
  },
  status: {
    type: String,
    enum: ["DONE", "IN_PROGRESS", "DONE"],
    default: "IN_PROGRESS",
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

taskSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

taskSchema.methods.softDelete = function() {
  this.deletedAt = new Date();
  return this.save();
};

const taskModel = mongoose.model("task", taskSchema);

module.exports = taskModel;
