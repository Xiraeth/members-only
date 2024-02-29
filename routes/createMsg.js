const express = require("express");
const router = express.Router();
const passport = require("passport");

const messageController = require("../controllers/messageController");

router.get("/", messageController.render_message_page);

router.post("/", messageController.create_message);

module.exports = router;
