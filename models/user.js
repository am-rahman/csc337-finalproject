/**
 * Creates a mongoose model for User and exports it.
 */

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

// Creating a schema for User
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: String,
    profileImage: String,
    followers: [ObjectId],
    following: [ObjectId],
});

// Creating indexes for faster searching
userSchema.index({ username: 1 });
userSchema.index({ username: 1, password: 1 });
userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);
