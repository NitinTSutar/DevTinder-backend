const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://nitintsuthar67:A9DXBW69LZHbZWRx@cluster0.zpknzf4.mongodb.net/"
    );
};

module.exports = { connectDB };