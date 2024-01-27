const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const isAuthentic = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.json({
      success: false,
      message: "Please login to access this resource",
    });
  }
  const decodedData = jwt.verify(token, "UBGOUHOLIHOSECRETKEY");
  req.user = await userModel.findById(decodedData.id);
  next();
};

module.exports = isAuthentic;
