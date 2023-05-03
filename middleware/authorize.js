const crypto = require("crypto");
const path = require("path");

async function authorize(req, res, next) {
    console.log("Incoming request:", req.method, req.path);

    console.log(
        "[authorize] req.session object before checking for sessionId:",
        req.session
    );

    const ip = req.ip;
    const agent = req.get("User-Agent");
    const sessionId = crypto
        .createHash("sha256")
        .update(ip + agent)
        .digest("hex");

    // Check if a valid session exists
    if (req.sessionID) {
        console.log(`Session ID found in express-session: ${req.sessionID}`);

        req.sessionStore.get(req.sessionID, (error, session) => {
            if (error) {
                console.error(`Error getting session from the store: ${error}`);
                res.sendStatus(500);
            }

            if (session) {
                console.log(
                    `Session found in the database: ${JSON.stringify(session)}`
                );
                console.log(
                    `[authorize] sessionID in DB: ${session.sessionID}`
                );
                if (
                    (req.method === "GET" && req.path === "/login") ||
                    (req.method === "GET" && req.path === "/create")
                ) {
                    res.redirect("/feed");
                } else {
                    next();
                }
            } else {
                console.log(`[authorize] No session found in the database`);
                if (
                    (req.method === "GET" && req.path === "/create") ||
                    (req.method === "GET" && req.path === "/login") ||
                    (req.method === "GET" && req.path === "/help")
                ) {
                    next();
                } else if (req.method === "GET") {
                    res.redirect("/login");
                } else {
                    next();
                }
            }
        });
    } else {
        console.log(`[authorize] No valid session found in express-session`);
        if (
            (req.method === "GET" && req.path === "/create") ||
            (req.method === "GET" && req.path === "/login")
        ) {
            next();
        } else {
            res.redirect("/login");
        }
    }
}

module.exports = authorize;
