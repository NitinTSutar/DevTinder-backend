const express = require("express");
const { connectDB } = require("./configs/database");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
const app = express();

app.use(cookieParser());
app.use(express.json());

// Creating a User
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Invalid Credentials");
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword) {
            // Create a JWT Token

            const token = await jwt.sign(
                { _id: user._id },
                "NITIN@Sutar$2001"
            );
            res.cookie("token", token);
            res.send("Login Succesfull");
        } else {
            throw new Error("Invalid Credentials");
        }
    } catch (err) {
        res.status(404).send("ERROR: " + err);
    }
});

// User Profile
app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            throw new Error("User does not exist");
        }
        res.send(user);
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

// Find user by EmailID
app.get("/user", async (req, res) => {
    const userEmail = req.body.email;
    try {
        const users = await User.find({
            email: userEmail,
        });
        if (users.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(users);
        }
    } catch (err) {
        res.status(400).send("Something went wrong" + err.message);
    }
});

// Feed / loading all the data
app.get("/feed", userAuth,  async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(users);
        }
    } catch (err) {
        res.status(400).send("Something went wrong" + err.message);
    }
});

// Delete user by ID
app.delete("/user", userAuth,  async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted Succesfully");
    } catch (err) {
        res.status(400).send("Something went wrong" + err.message);
    }
});

// Update user by ID
app.patch("/user/:userId", userAuth, async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try {
        const ALLOWED_UPDATES = [
            "photoUrl",
            "about",
            "firstName",
            "lastName",
            "password",
            "age",
            "gender",
            "skills",
        ];
        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
        );
        if (!isUpdateAllowed) {
            throw new Error("Update not Allowed");
        }
        if (Array.isArray(data.skills) && data.skills.length > 10) {
            throw new Error("Skills cannot be more than 10");
        }

        const user = await User.findByIdAndUpdate(userId, data, {
            runValidators: true,
        });
        res.send("User Updated Succesfully");
    } catch (err) {
        res.status(400).send("Something went wrong" + err.message);
    }
});

connectDB()
    .then(() => {
        console.log("connected to DB");
        app.listen(3000, () => {
            console.log("Server is successfully listening as port 3000");
        });
    })
    .catch((err) => {
        console.log("DB not connected");
    });
