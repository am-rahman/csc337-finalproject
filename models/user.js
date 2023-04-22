/**
 * @fileoverview Create model for Post document and export it.
 */

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: String,
    profileImage: String,
    followers: [{ type: ObjectId, ref: "User" }],
    following: [ObjectId],
});

// Creating indexes for faster searching
userSchema.index({ username: 1 });
userSchema.index({ username: 1, password: 1 });
userSchema.index({ email: 1 });

/**
 * @typedef {Object} UserModel
 * @property {String} username - The username of the user
 * @property {String} email - The email of the user
 * @property {String} password - The password of the user
 * @property {String} bio - The bio of the user
 * @property {String} profileImage - The profile image of the user
 * @property {ObjectId[]} followers - The users who follow the user
 * @property {ObjectId[]} following - The users who the user follows
 */
const User = mongoose.model("User", userSchema);
module.exports = User;
