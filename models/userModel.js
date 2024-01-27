const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    minlength: [
      10,
      "Phone number should not be less than or greater than 10 characters",
    ],
    maxlength: [
      10,
      "Phone number should not be less than or greater than 10 characters",
    ],
  },
  priority: { type: Number, required: true },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.methods.generateJWT = async function(){
  const token = jwt.sign({ id: this._id }, "UBGOUHOLIHOSECRETKEY");
  return token;
};
const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
