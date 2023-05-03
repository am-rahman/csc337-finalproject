const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
    {
        _id: String,
        expires: Date,
        session: String,
    },
    { collection: "your_collection_name" }
); // Replace with your sessions collection name

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
