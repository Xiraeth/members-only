const express = require("express");
const router = express.Router();
const passport = require("passport");

const messageController = require("../controllers/messageController");

router.get("/delete_post/:id", messageController.delete_post);

module.exports = router;
