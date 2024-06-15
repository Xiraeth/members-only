const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("signup", { title: "Sign up" });
});

router.post("/", userController.create_user);

module.exports = router;
