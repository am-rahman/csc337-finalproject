/**
 * Creates the Post model and exports it.
 */

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

//Creating a schema for Post
const postSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
    body: { type: String, required: true },
    time: { type: Date, default: Date.now },
    likes: [ObjectId],
    comments: [ObjectId],
});

//Creating a conpound index by user (ascending) and time (descending)
postSchema.index({ user: 1, time: -1 });

module.exports = mongoose.model("Post", postSchema);
