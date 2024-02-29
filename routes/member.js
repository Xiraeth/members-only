const express = require("express");
const router = express.Router();
const passport = require("passport");

const userController = require("../controllers/userController");

router.get("/", userController.render_member_page);

router.post("/", userController.update_member_status);

module.exports = router;
