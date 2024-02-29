const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Message = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

Message.virtual("timestamp").get(function () {
  return `${this.date.toLocaleDateString("en-GB")}`;
});

module.exports = mongoose.model("Message", Message);
