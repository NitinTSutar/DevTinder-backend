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
const userRouter = require("./routes/user")

app.use("/", authRouter);
app.use("/", requestRouter);
app.use("/", profileRouter);
app.use("/", userRouter);

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
