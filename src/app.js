const express = require("express");
const { connectDB } = require("./configs/database");
// const User = require("./models/user");
const cookieParser = require("cookie-parser");
// const { userAuth } = require("./middlewares/auth");
const app = express();
// const { validateSignUpData } = require("./utils/validation");
// const jwt = require("jsonwebtoken");

app.use(cookieParser());
app.use(express.json());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", requestRouter);
app.use("/", profileRouter);

// // Find user by EmailID
// app.get("/user", async (req, res) => {
//     const userEmail = req.body.email;
//     try {
//         const users = await User.find({
//             email: userEmail,
//         });
//         if (users.length === 0) {
//             res.status(404).send("User not found");
//         } else {
//             res.send(users);
//         }
//     } catch (err) {
//         res.status(400).send("Something went wrong" + err.message);
//     }
// });

// // Feed / loading all the data
// app.get("/feed", userAuth, async (req, res) => {
//     try {
//         const users = await User.find({});
//         if (users.length === 0) {
//             res.status(404).send("User not found");
//         } else {
//             res.send(users);
//         }
//     } catch (err) {
//         res.status(400).send("Something went wrong" + err.message);
//     }
// });

// // Delete user by ID
// app.delete("/user", userAuth, async (req, res) => {
//     const userId = req.body.userId;
//     try {
//         const user = await User.findByIdAndDelete(userId);
//         res.send("User deleted Succesfully");
//     } catch (err) {
//         res.status(400).send("Something went wrong" + err.message);
//     }
// });

// // Update user by ID
// app.patch("/user/:userId", userAuth, async (req, res) => {
//     const userId = req.params?.userId;
//     const data = req.body;
//     try {
//         const ALLOWED_UPDATES = [
//             "photoUrl",
//             "about",
//             "firstName",
//             "lastName",
//             "password",
//             "age",
//             "gender",
//             "skills",
//         ];
//         const isUpdateAllowed = Object.keys(data).every((k) =>
//             ALLOWED_UPDATES.includes(k)
//         );
//         if (!isUpdateAllowed) {
//             throw new Error("Update not Allowed");
//         }
//         if (Array.isArray(data.skills) && data.skills.length > 10) {
//             throw new Error("Skills cannot be more than 10");
//         }

//         const user = await User.findByIdAndUpdate(userId, data, {
//             runValidators: true,
//         });
//         res.send("User Updated Succesfully");
//     } catch (err) {
//         res.status(400).send("Something went wrong" + err.message);
//     }
// });

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
