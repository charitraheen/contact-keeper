const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check, validatorResult } = require("express-validator");

const User = require("../models/User");

// @route   POST api/auth
// @desc    Register in user
// @access  Public

router.post(
  "/",
  [
    check("name", "Please add name").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validatorResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.getSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      res.send("User send");
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
