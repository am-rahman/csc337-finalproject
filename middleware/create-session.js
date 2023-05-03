// Importing the crypto module
const crypto = require("crypto");

// Defining a function to create a session
function createSession(req, res, next) {
    // Getting the IP address and User-Agent from the request object
    const ip = req.ip;
    const userAgent = req.get("User-Agent");

    // Creating a hash using the SHA-256 algorithm
    const hash = crypto.createHash("sha256");
    // Updating the hash with the IP address and User-Agent
    hash.update(ip + userAgent);
    // Generating a session ID by digesting the hash
    const sessionID = hash.digest("hex");

    // Storing the session ID and username in the session object
    req.session.sessionID = sessionID;
    req.session.username = req.body.username;

    // Saving the session and calling the next middleware function
    req.session.save();
    next();
}

// Exporting the createSession function
module.exports = createSession;
