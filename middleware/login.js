const bcrypt = require("bcrypt");
const User = require("../models/user");
const createSession = require("./create-session");

async function login(req, res, next) {
    try {
        // Extracting the username and password from the request body
        const { username, password } = req.body;

        // Finding a user with the provided username
        const user = await User.findOne({
            username: { $regex: new RegExp(`^${username}$`, "i") },
        });

        // If user is not found, send an error response
        if (!user) {
            return res.status(401).json({ message: "Incorrect username" });
        }

        // If user is found, compare the provided password with the stored hashed password
        const match = await bcrypt.compare(password, user.password);

        // If the passwords don't match, send an error response
        if (!match) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        // If the passwords match, set a cookie and send a success response
        createSession(req, res, next);
        return res.status(200).end();
    } catch (error) {
        // Handle errors
        next(error);
    }
}

// Exporting the login function
module.exports = login;
