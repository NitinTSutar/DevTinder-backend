const express = require("express");
const { connectDB } = require("./configs/database");
const User = require("./models/user");
const app = express();

app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: "Nitin",
        lastName: "Suthar",
        email: "nitin.suthar@example.com",
        password: "password123",
        age: 25,
        gender: "male",
    });

    try {
        await user.save();
        res.send("User created successfully");
    } catch (err) {
        res.status(400).send("user not created", err.message);
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
