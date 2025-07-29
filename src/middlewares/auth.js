const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try{
        const { token } = req.cookies;
        if(!token) {
           return res.status(401).send("Please login!")
        }

        const decodeObj = await jwt.verify(token, "NITIN@Sutar$2001")

        const user = await User.findById(decodeObj._id);
        if(!user){
            throw new Error("User not found")
        }

        req.user = user;
        next();
    }catch(err){
        res.status(400).json({ message: err.message });
    }
}

module.exports = {
    userAuth
}