const express = require("express");
const userModel = require("../models/userModel");
const userRoutes = express.Router();

userRoutes.post("/createProfile", async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    let user = await userModel.findOne({ phoneNumber: phoneNumber });
    if (!user) {
      user = await userModel.create(req.body);
    }
    const token = await user.generateJWT();
    const options = {
      expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    return res
      .status(200)
      .cookie("token", token, options)
      .json({ message: "You have registered successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Error in creating user", error });
  }
});

module.exports = userRoutes;
