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
    const existingUser = await User.findOne({ username: req.body.username });
    const existingEmail = await User.findOne({ email: req.body.email });
    res.set("Content-Type", "application/json");
    //cheack if username or email already exists
    if (existingUser) {
        console.log("User already exists");
        console.log(`Existing User: ${existingUser}`);
        res.status(409); //If username already exists, sending Conflict status and the error message
        res.send({ message: "Username already exists" });
    } else if (existingEmail) {
        res.status(409); //If email already exists, sending Conflict status and the error message
        res.send({ message: "Email already exists" });
    } else {
        const hashedPassword = await encryptPassword(req.body.password); //Encrypting the password using bcrypt

        //Create new user document
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        console.log(`User created: ${newUser}`);

        try {
            await newUser.save(); //Saving the new user in the database
            res.status(201); //Sending success status and the success message
            res.send({ message: `Welcome to chatter ${req.body.username}` });
        } catch (err) {
            res.status(500); //If error occurs, sending Internal Server Error and the error message
            res.send({ message: "Server error, please try again later." });
        }
    }
}

async function checkExisting(req, res) {}

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
