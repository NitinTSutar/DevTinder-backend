const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");


// Creating a User
authRouter.post("/signup", async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        //Data validation
        validateSignUpData(req);

        // Encrpt the password
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
        });

        await user.save();
        res.send("User created successfully");
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

// User login
authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Invalid Credentials");
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword) {
            const token = await user.getJWT();

            res.cookie("token", token);
            res.send("Login Succesfull");
        } else {
            throw new Error("Invalid Credentials");
        }
    } catch (err) {
        res.status(404).send("ERROR: " + err);
    }
});

module.exports = authRouter;
