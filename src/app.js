const express = require("express");
const { connectDB } = require("./configs/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.send("User created successfully");
    } catch (err) {
        res.status(400).send("user not created", err.message);
    }
});

app.get("/user", async (req, res) => {
    const userEmail = req.body.email;
    try {
        const users = await User.find({
            email: userEmail,
        });
        if(users.length === 0 ){
            res.status(404).send("User not found")
        }else{
            res.send(users);
        }
    } catch (err) {
        res.status(400).send("Something went wrong", err.message);
    }
});

app.get("/feed", async (req, res) =>{
    try{
        const users = await User.find({})
        if(users.length === 0 ){
            res.status(404).send("User not found")
        }else{
            res.send(users);
        }
    }catch (err){
        res.status(400).send("Something went wrong", err.message);
    }
})

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
