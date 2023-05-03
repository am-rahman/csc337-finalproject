const crypto = require("crypto");

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
                return res.sendStatus(500);
            }

            if (session) {
                console.log(
                    `Session found in the database: ${JSON.stringify(session)}`
                );
                console.log(
                    `[authorize] sessionID in DB: ${session.sessionID}`
                );
                if (req.method === "GET" && req.path === "/login") {
                    res.redirect("/feed");
                } else {
                    next();
                }
            } else {
                console.log(`[authorize] No session found in the database`);
                res.redirect("/login");
            }
        });
    } else {
        console.log(`[authorize] No valid session found in express-session`);
        res.redirect("/login");
    }
}

module.exports = authorize;
