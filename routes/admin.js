const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.get("/", userController.user_admin_get);

router.post("/", userController.user_admin_post);

module.exports = router;
