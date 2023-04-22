const bcrypt = require("bcrypt");
const User = require("../models/user");

// An async function that handles user login
async function login(req, res) {
    // Extracting the username and password from the request body
    const { username, password } = req.body;

    // Finding a user with the provided username
    const user = await User.findOne({ username: username });

    // If user is not found, send an error response
    if (!user) {
        res.status(401);
        res.send({ message: "User not found" });
    } else {
        // If user is found, compare the provided password with the stored hashed password
        const match = await bcrypt.compare(password, user.password);

        // If the passwords match, set a cookie and send a success response
        if (match) {
            const expireAfter = 24 * 60 * 60 * 1000; // Cookie expiration time (1 day)
            res.status(200);
            res.cookie("logged-in", user._id, { expireAfter }); // Setting a cookie named "logged-in" with the user's ID as value
            res.send({ message: "Login successful" });
        } else {
            // If the passwords don't match, send an error response
            res.status(401);
            res.send({ message: "Incorrect password" });
        }
    }
}

// Exporting the login function
module.exports = login;
