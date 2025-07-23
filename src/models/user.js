const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
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

module.exports = mongoose.model("User", userSchema);
