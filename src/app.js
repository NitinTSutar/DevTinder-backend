const express = require("express");
const { connectDB } = require("./configs/database");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const app = express();

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
app.get("/feed", async (req, res) => {
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
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete({ _id: userId });
        res.send("User deleted Succesfully");
    } catch (err) {
        res.status(400).send("Something went wrong" + err.message);
    }
});

// Update user by ID
app.patch("/user/:userId", async (req, res) => {
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

        const user = await User.findByIdAndUpdate({ _id: userId }, data, {
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
