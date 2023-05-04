/**
 * @fileoverview Create model for Post document and export it.
 */

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const User = require("./user"); // Import the User model

const postSchema = new mongoose.Schema({
    user: {
        type: String,
        ref: "User",
        required: true,
    },
    body: { type: String, required: true },
    time: { type: Number, default: () => Number(process.hrtime.bigint()) },
    likes: [{ type: ObjectId, ref: "User" }],
    // comments: [{ type: ObjectId, ref: "Comment" }],
});

//Creating a compound index by user (ascending) and time (descending)
postSchema.index({ user: 1, time: -1 });

//Creating an index on by user
postSchema.index({ user: 1 });

//TODO: Remove this if not referencing the post in the user document
// Middleware to add a reference to the post in the user document
// postSchema.pre("save", async function (next) {
//     try {
//         const post = this;

//         // Update the user document by adding the post id to the 'posts' field
//         await User.updateOne(
//             { username: post.user },
//             { $push: { posts: post._id } }
//         );

//         next();
//     } catch (error) {
//         next(error);
//     }
// });

/**
 * @typedef {Object} PostModel
 * @property {String} user - The user who created the post
 * @property {String} body - The body of the post
 * @property {Number} time - The time the post was created (leave empty to use current time)
 * @property {ObjectId[]} likes - The users who liked the post
 */
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
