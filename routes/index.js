const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageController");

/* GET home page. */
router.get("/", messageController.messages_list);

module.exports = router;
