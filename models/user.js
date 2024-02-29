const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  firstname: { type: String, required: true, minlength: 1 },
  lastname: { type: String, required: true, minlength: 1 },
  username: { type: String, required: true, minlength: 1 },
  password: { type: String, required: true, minlength: 1 },
  isMember: { type: Boolean },
  isAdmin: { type: Boolean },
});

User.virtual("fullname").get(function () {
  return `${this.firstname} ${this.lastname}`;
});

module.exports = mongoose.model("User", User);
