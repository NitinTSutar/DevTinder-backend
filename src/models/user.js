const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 2,
            maxLength: 50,
        },
        lastName: {
            type: String,
            required: true,
            minLength: 2,
            maxLength: 50,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Invalid email addres" + value);
                }
            },
        },
        password: {
            type: String,
            required: true,
            // validate(value){
            //     if(!validator.isStrongPassword(value)){
            //         throw new Error("Password not strong enough - 8 character, 1 lowercare, 1 uppcase" + value)
            //     }
            // }
        },
        age: {
            type: Number,
            min: 18,
        },
        gender: {
            type: String,
            validate(value) {
                if (!["male", "female", "other"].includes(value)) {
                    throw new Error("Gender data is not valid");
                }
            },
        },
        photoUrl: {
            type: String,
            default:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStRLOLL5E8Hl382V4FZMIcMkMkTT2FELW38A&s",
            validate(value) {
                if (!validator.isURL(value)) {
                    throw new Error("Invalid Photo  URL addres" + value);
                }
            },
        },
        about: {
            type: String,
        },
        skills: {
            type: [String],
        },
    },
    { timestamps: true }
);

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({ _id: user._id }, "NITIN@Sutar$2001", {
        expiresIn: "30d",
    });

    return token;
};
module.exports = mongoose.model("User", userSchema);
