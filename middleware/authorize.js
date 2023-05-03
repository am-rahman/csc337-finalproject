const crypto = require("crypto");
const Session = require("../models/session");

async function authorize(req, res, next) {
    // Create hash from IP address and user-agent
    const sessionId = crypto
        .createHash("sha256")
        .update(req.ip + req.headers["user-agent"])
        .digest("hex");

    console.log(`[authorize] Generated sessionId: ${sessionId}`);
    console.log(
        `[authorize] req.session object before checking for sessionId:`,
        req.session
    );
    // If express-session has a valid session, check for sessionId in the session data
    if (
        req.session &&
        req.session.sessionID &&
        req.session.sessionID === sessionId
    ) {
        console.log(
            `Session ID found in express-session: ${req.session.sessionID}`
        );

        const sessionRegex = new RegExp(`"sessionID":"${sessionId}"`);
        const targetSession = await Session.findOne({
            session: { $regex: sessionRegex, $options: "i" },
        });

        if (targetSession) {
            console.log(
                `Session found in the database: ${JSON.stringify(
                    targetSession
                )}`
            );
            const sessionData = JSON.parse(targetSession.session);

            if (sessionData && sessionData.username) {
                // If the session exists and has a username, the user is logged in
                req.isLoggedIn = true;
                req.username = sessionData.username;
                console.log(
                    `[authorize] User is logged in with username: ${req.username}`
                );
            } else {
                // If not, the user is not logged in
                req.isLoggedIn = false;
                console.log(
                    "[authorize] No username found in the session data"
                );
            }
        } else {
            req.isLoggedIn = false;
            console.log("[authorize] No session found in the database");
        }
    } else {
        // If express-session doesn't have a valid session or sessionId doesn't match, the user is not logged in
        console.log(
            `[authorize] req.session.sessionId: "${req.session.sessionId}", length: ${req.session.sessionId?.length}`
        );
        console.log(
            `[authorize] sessionId: "${sessionId}", length: ${sessionId.length}`
        );

        req.isLoggedIn = false;
        console.log("[authorize] No valid session found in express-session");
    }

    next();
}

module.exports = authorize;
