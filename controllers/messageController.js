const User = require("../models/user");
const Message = require("../models/message");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

exports.messages_list = asyncHandler(async (req, res, next) => {
  const allMessages = await Message.find({})
    .sort({ timestamp: 1 })
    .populate("user")
    .exec();

  res.render("index", {
    user: req.user,
    messages: allMessages,
  });
});

exports.render_message_page = asyncHandler(async (req, res, next) => {
  res.render("createMsg", {
    title: "Write your own message to post to the board!",
  });
});

exports.create_message = [
  body("messageField", "Please fill out both fields")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const user = req.user;

    const message = new Message({
      title: req.body.msgTitle,
      message: req.body.messageField,
      date: new Date(),
      user: user,
    });

    if (!errors.isEmpty()) {
      res.render("createMsg", {
        title: "Write your own message to post to the board!",
        errors: errors.array(),
      });
    } else {
      await message.save();
      res.redirect("/");
    }
  }),
];

exports.delete_post = asyncHandler(async (req, res, next) => {
  const messageId = req.params.id;

  if (req.user && req.user.isAdmin) {
    await Message.findByIdAndDelete(messageId);
    res.redirect("/");
  } else {
    // Handle unauthorized deletion attempt
    res.status(403).send("Unauthorized to delete messages");
  }
});
