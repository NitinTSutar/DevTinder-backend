const express = require("express");
const {connectDB} = require("./configs/database");
const app = express();

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
