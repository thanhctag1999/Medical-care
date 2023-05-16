var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  avatar: { type: String },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String },
  createdAt: { type: Date, default: new Date() },
  isDeleted: { type: Boolean, default: false },
  birthday: { type: Date },
  role: { type: String, default: "User" },
  degree: { type: String },
  link: { type: String },
  rating: { type: Number },
  gender: { type: String, default: "Nam" },
  specialist: { type: String },
  position: { type: String },
  experience: { type: Number },
  description: { type: String },
  certificate: { type: String },
});

module.exports = mongoose.model("User", UserSchema);
