const crypto = require("crypto");
const Session = require("../models/session");

async function createSession(req, res, next) {
    const ip = req.ip;
    const userAgent = req.get("User-Agent");

    const hash = crypto.createHash("sha256");
    hash.update(ip + userAgent);
    const sessionID = hash.digest("hex");

    req.session.sessionID = sessionID;
    req.session.username = req.body.username;

    req.session.save(async (err) => {
        if (err) {
            console.log("[createSession] Error saving session:", err);
            return;
        }
        console.log("[createSession] Session saved successfully");

        // Log the saved session data from the database
        try {
            const sessionData = await Session.findOne({ _id: req.session.id });
            console.log(
                "[createSession] Saved session data:",
                JSON.stringify(sessionData)
            );
        } catch (err) {
            console.log("[createSession] Error fetching saved session:", err);
        }

        next();
    });
}

module.exports = createSession;
