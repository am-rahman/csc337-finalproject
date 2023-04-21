/**
 * This middleware is used to create a new user in the database. It first checks if the username and email are already in use
 * if copies are not found, it encrypts the password and saves the new user in the database.
 */

const bcrypt = require("bcrypt"); //Bcrypt is used to hash passwords
const User = require("../models/user"); //Importing the User model

/**
 * Creates a new user in the database after verifying that the username and email are
 * not already in use. Then encrypts the password by calling encryptPassword function
 * and saves the new user in the database.
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
async function addUser(req, res) {
    const existingUser = await User.findOne({ username: req.body.username }); //Checking if the username already exists
    if (existingUser) {
        return res.status(409).send("Username already exists"); //If username already exists, sending Conflict status and the error message
    }
    const existingEmail = await User.findOne({ email: req.body.email });
    if (existingEmail) {
        return res.status(409).send("Email already exists"); //If email already exists, sending Conflict status and the error message
    }
    const hashedPassword = await encryptPassword(req.body.password); //Encrypting the password using bcrypt

    //Create new user document
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    });

    try {
        await newUser.save(); //Saving the new user in the database
        res.status(201).send(`Welcome to chatter ${req.body.username}`); //Sending success status and the success message
    } catch (err) {
        res.status(500).send(
            "Error while creating user, please try again later."
        ); //If error occurs, sending Internal Server Error and the error message
    }
}

/**
 * Uses the bcrypt module to encrypt the password
 * @param {String} password: The password to encrypt
 * @returns the encrypted password
 */
async function encryptPassword(password) {
    const salt = await bcrypt.genSalt(10); //Generating a salt for hashing
    const hashedPassword = await bcrypt.hash(password, salt); //Hashing the password
    return hashedPassword;
}

module.exports = addUser;
