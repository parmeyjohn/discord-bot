const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: { type: String },
  username: { type: String },
  birthday: { type: String, default: "" },
});

module.exports = mongoose.model("User", userSchema);
