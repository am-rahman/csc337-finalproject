const bcrypt = require("bcrypt");
const User = require("../models/user");

// An async function that handles user login
async function login(req, res) {
    // Extracting the username and password from the request body
    const { username, password } = req.body;

    // Finding a user with the provided username
    const user = await User.findOne({
        username: { $regex: new RegExp(`^${username}$`, "i") },
    });

    // If user is not found, send an error response
    if (!user) {
        res.status(401);
        res.send({ message: "Incorrect username" });
    } else {
        // If user is found, compare the provided password with the stored hashed password
        const match = await bcrypt.compare(password, user.password);

        // If the passwords match, set a cookie and send a success response
        if (match) {
            req.session.user = {
                id: user._id,
                username: user.username,
            };
            res.cookie(`user=${username};; SameSite=None; Secure`);
            res.status(200);
            res.redirect("/");
        } else {
            // If the passwords don't match, send an error response
            res.status(401);
            res.send({ message: "Incorrect password" });
        }
    }
}

// Exporting the login function
module.exports = login;
