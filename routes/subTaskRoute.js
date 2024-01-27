const express = require("express");
const isAuthentic = require("../db/auth");
const subTaskModel = require("../models/subTaskModel");
const taskModel = require("../models/taskModel");
const subtaskRoute = express.Router();

subtaskRoute.post("/create", isAuthentic, async (req, res) => {
  try {
    const { status, taskId } = req.body;

    //Check if the task exist only then create subtask for that
    const existingTask = await taskModel.findById(taskId);
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const subtask = await subTaskModel.create({ status, taskId });
    return res.status(200).json({ message: "Subtask created", subtask });
  } catch (error) {
    return res.status(500).json({ message: "Error in creating Subtask", error });
  }
});

subtaskRoute.delete("/delete/:subtaskId", isAuthentic, async (req, res) => {
  try {
    const subtaskId = req.params.subtaskId;

    // Check if the subtask_id is valid
    const existingSubtask = await subTaskModel.findById(subtaskId);
    if (!existingSubtask) {
      return res.status(404).json({ message: "Subtask not found" });
    }

    // Delete the subtask
    await existingSubtask.softDelete();
    return res
      .status(200)
      .json({ message: "Subtask deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error in deleting task", error });
  }
});

subtaskRoute.put("/update/:subtaskId", isAuthentic, async (req, res) => {
  try {
    const subtaskId = req.params.subtaskId;

    // Check if the subtask_id is valid
    const existingSubtask = await subTaskModel.findById(subtaskId);
    if (!existingSubtask) {
      return res.status(404).json({ message: "Subtask not found" });
    }

    // Update subtask fields based on the request body
    const { status, taskId } = req.body;
    //Checking if the user has passed taskId so updation will not happen
    // as  it is asked to update only status
    if (taskId) {
      return res
        .status(400)
        .json({
          message: "TaskId cannot be updated, please update status only",
        });
    }

    if (status) {
      existingSubtask.status = status;
    }
    await existingSubtask.save();
    return res.status(200).json({
      message: "Subtask updated successfully",
      subtask: existingSubtask,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error in updating task", error });
  }
});

subtaskRoute.get("/:taskId", isAuthentic, async (req, res) => {
  try {
    const { taskId } = req.params;
    const subtasks = await subTaskModel.find({ taskId });
    if(subtasks.length == 0){
      return res.status(404).json({message:'No subtask associated fot the given tasksId'})
    }
    return res.status(200).json({ subtasks });
  } catch (error) {
    return res.status(500).json({ message: "Error in fetching subtasks", error });
  }
});

module.exports = subtaskRoute;
