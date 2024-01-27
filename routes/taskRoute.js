const express = require("express");
const taskModel = require("../models/taskModel");
const isAuthentic = require("../db/auth");

const taskRoute = express.Router();

taskRoute.post("/create", isAuthentic, async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = await taskModel.create({ title, description, user: req.user });
    return res.status(200).json({ message: "Task created", task });
  } catch (error) {
    return res.status(500).json({ message: "Error in creating task", error });
  }
});

taskRoute.delete("/delete/:taskId", isAuthentic, async (req, res) => {
  try {
    const taskId = req.params.taskId;

    // Check if the taskId is valid
    const existingTask = await taskModel.findById(taskId);
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    await existingTask.softDelete();
    return res.status(200).json({ message: "Task soft deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error in deleting task", error });
  }
});

taskRoute.put("/update/:taskId", isAuthentic, async (req, res) => {
  try {
    const taskId = req.params.taskId;

    // Check if the taskId is valid
    const existingTask = await taskModel.findById(taskId);
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update task fields based on the request body
    const { status, dueDate, title, description } = req.body;

    //Checking if the user has passed title and description so updation will not happen
    // as  it is asked to update only status and dueDate
    if (title || description) {
      return res.status(400).json({
        message:
          "Title and description cannot be updated, please update status and dueDate only",
      });
    }

    if (status) {
      existingTask.status = status;
    }
    if (dueDate) {
      existingTask.dueDate = dueDate;
    }
    await existingTask.save();
    return res
      .status(200)
      .json({ message: "Task updated successfully", task: existingTask });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error in updating task", error });
  }
});

taskRoute.get("/tasks", isAuthentic, async (req, res) => {
  try {
    // Extract query parameters
    let { dueDate, page = 1 } = req.query;
    const {_id} = req.user;
    const tasks = await taskModel.find({user:_id});
    const size = tasks.length;

    // Filter tasks by dueDate if provided
    let filteredTasks = tasks;
    if (dueDate) {
      //It will filter all task whose date is overdue of today
      filteredTasks = tasks.filter((task) => task.dueDate <= dueDate);
    }

    // Pagination
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

    // Send the response
    return res.status(200).json({tasks:paginatedTasks});
  } catch (error) {
    // Handle errors
    return res.status(500).json({ message: "Error in fetching tasks", error });
  }
});

module.exports = taskRoute;
