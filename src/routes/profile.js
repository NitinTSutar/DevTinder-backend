const express = require("express");
const { userAuth } = require("../middlewares/auth");
const profileRouter = express.Router();
const { validateEditProfileData } = require("../utils/validation");
const validator = require("validator");
const User = require("../models/user");
const bcrypt = require("bcrypt");
// User Profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error("User does not exist");
    }
    res.json({user});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: "$(loggedInUser), Your Profile Updated successfuly",
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { password } = req.body;

    if (!validator.isStrongPassword(password)) {
      throw new Error("New password is not strong enough");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    req.user.password = hashedPassword;
    await req.user.save();

    res.json({message: "password updated successfuly"});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = profileRouter;
