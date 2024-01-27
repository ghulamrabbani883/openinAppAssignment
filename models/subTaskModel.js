const mongoose = require("mongoose");

const subTaskSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.ObjectId, ref: "task" },
  status: { type: Number, default:0 },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  },
  deletedAt: {
    type: Date,
    default:null
  },
});


subTaskSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

subTaskSchema.methods.softDelete = function() {
  this.deletedAt = new Date();
  return this.save();
};

const subTaskModel = mongoose.model("subtask", subTaskSchema);

module.exports = subTaskModel;
