const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

exports.create_user = [
  body("firstname", "First name field cannot be empty")
    .trim()
    .isLength({ min: 1, max: 16 })
    .custom((value, { req }) => {
      if (value.length > 16) {
        throw new Error("First name cannot be more than 16 characters long");
      }
      return true;
    })
    .escape(),
  body("lastname", "Last name field cannot be empty")
    .trim()
    .custom((value, { req }) => {
      if (value.length > 16) {
        throw new Error("Last name cannot be more than 16 characters long");
      }
      return true;
    })
    .escape(),
  body("username", "Username field cannot be empty")
    .trim()
    .custom(async (value, { req }) => {
      if (value.length > 16) {
        throw new Error("Username cannot be more than 16 characters long");
      }

      const existingUser = await User.findOne({ username: value });
      if (existingUser) {
        throw new Error("Username is already taken");
      }
      return true;
    })

    .escape(),
  body("password", "Password field cannot be empty").trim().escape(),
  body("passConfirm", "Passwords don't match")
    .trim()
    .custom((value, { req }) => value === req.body.password)
    .escape(),

  asyncHandler(async (req, res, next) => {
    try {
      const errors = validationResult(req);

      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          return next(err);
        }

        const user = new User({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          username: req.body.username,
          password: hashedPassword,
          isMember: false,
        });

        if (!errors.isEmpty()) {
          res.render("signup", {
            title: "Sign up",
            user: user,
            errors: errors.array(),
          });
        } else {
          // Implement create_user and log in
          await user.save();
          res.redirect("/");
        }
      });
    } catch (err) {
      return next(err);
    }
  }),
];

exports.render_member_page = asyncHandler(async (req, res, next) => {
  res.render("member", {
    title: "Become a member",
  });
});

exports.update_member_status = [
  body("secretPhrase")
    .trim()
    .custom(async (value, { req }) => {
      if (value !== process.env.SECRET_PHRASE) {
        throw new Error("That is not the secret phrase. Try again.");
      }
      return true;
    }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("member", {
        title: "Become a member",
        errors: errors.array(),
        hint: "You hold the gem to it's face and speak the password...",
        user: req.user,
      });
    } else {
      await User.findByIdAndUpdate(req.user._id, { isMember: true });
      res.redirect("/");
    }
  }),
];

exports.user_admin_get = asyncHandler(async (req, res, next) => {
  res.render("admin", {
    title: "Become an admin",
  });
});

exports.user_admin_post = [
  body("secretPhrase")
    .trim()
    .custom(async (value, { req }) => {
      if (value !== process.env.ADMIN_SECRET_PHRASE) {
        throw new Error("That is not the secret phrase. Try again.");
      }
      return true;
    }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("admin", {
        title: "Become an admin",
        hint: "The password is contained in the captain's log...",
        errors: errors.array(),
      });
    } else {
      await User.findByIdAndUpdate(req.user._id, { isAdmin: true });
      res.redirect("/");
    }
  }),
];
