/**
 * @fileoverview Create model for Post document and export it.
 */

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
    body: { type: String, required: true },
    time: { type: Number, default: process.hrtime.bigint() },
    likes: [{ type: ObjectId, ref: "User" }],
    comments: [{ type: ObjectId, ref: "Comment" }],
});

//Creating a conpound index by user (ascending) and time (descending)
postSchema.index({ user: 1, time: -1 });

/**
 * @typedef {Object} PostModel
 * @property {ObjectId} user - The user who created the post
 * @property {String} body - The body of the post
 * @property {Number} time - The time the post was created (leave empty to use current time)
 * @property {ObjectId[]} likes - The users who liked the post
 * @property {ObjectId[]} comments - The comments on the post
 */
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
