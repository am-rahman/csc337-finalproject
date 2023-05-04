const {
    DB_URL,
    SECRET,
    PORT,
    DB_NAME,
    SESSION_STORE,
    express,
    mongoose,
    bodyParser,
    path,
    check,
    session,
    crypto,
    login,
    MongoStore,
    validate,
    addUser,
    User,
    Post,
    authorize,
} = require("./config");
const app = express();
const port = PORT;

console.log(DB_URL + DB_NAME);

//Connecting to a MongoDB database 'chatter'
mongoose.connect(DB_URL + DB_NAME, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//Using body-parser to extract the entire body portion of an incoming request stream
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const store = new MongoStore({
    mongoUrl: DB_URL + SESSION_STORE,
    ttl: 24 * 60 * 60, //1 day
});

//Using express-session to create a session middleware
// const sessionSecret = crypto.randomBytes(32).toString("hex");
app.use(
    session({
        secret: SECRET,
        resave: false,
        saveUninitialized: false,
        store: store,
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, //1 day
        },
    })
);

//Serving static files from public_html folder using Express.static
app.use(express.static(path.join(__dirname, "public_html")));

app.use(authorize); //Using authorize middleware to check if the user is logged in
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.path}`);
    next();
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public_html", "login.html"));
});

app.get("/settings", (req, res) => {
    res.sendFile(path.join(__dirname, "public_html", "settings.html"));
});

app.get("/feed", (req, res) => {
    res.sendFile(path.join(__dirname, "public_html", "feed.html"));
});

app.get("/help", (req, res) => {
    res.sendFile(path.join(__dirname, "public_html", "help.html"));
});

app.get("/search", (req, res) => {
    res.sendFile(path.join(__dirname, "public_html", "search.html"));
});

app.get("/account-help", (req, res) => {
    res.sendFile(path.join(__dirname, "public_html", "account-help.html"));
});

app.get("/create", (req, res) => {
    res.sendFile(path.join(__dirname, "public_html", "create-account.html"));
});

//Using express-validator to validate the input
const userValidationRules = [
    // Username validation
    check("username")
        .trim()
        .isAlphanumeric()
        .withMessage("Username must contain only letters and numbers")
        .isLength({ min: 3, max: 15 })
        .withMessage("Username must be between 3 and 15 characters long"),

    // Password validation
    check("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/\d/)
        .withMessage("Password must contain at least one number")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter")
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage("Password must contain at least one special character"),

    // Email validation
    check("email")
        .isEmail()
        .withMessage("Invalid email format")
        .normalizeEmail(),
];

// Validation rules for just username when logging in,
// NOT IN USE
const loginValidationRules = [
    // Username validation
    check("username")
        .trim()
        .isAlphanumeric()
        .withMessage("Username must contain only letters and numbers")
        .isLength({ min: 3, max: 15 })
        .withMessage("Username must be between 3 and 15 characters long"),
];

//TODO: Add validation rules for post
const postValidationRules = [
    check("body")
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage("Post must be between 1 and 200 characters long"),
];

app.post("/posts/add", postValidationRules, validate, async (req, res) => {
    try {
        const { body } = req.body;
        const { username } = req.session;

        const post = new Post({ body: body, user: username });
        await post.save();
        console.log(`New post added by ${username}: ${body}`);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

//TODO: Delete/comment endpoint after development
// Creating GET endpoint for retrieving all posts in '/posts' route
app.get("/posts/get", (req, res) => {
    Post.find()
        .then((posts) => {
            //Finding all posts in the database
            res.send(posts); //Sending all posts data
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Server Error"); //If error occurs, sending Internal Server Error and the error message
        });
});

//Creating POST endpoint for creating a new user in '/users' route
app.post("/users/add", userValidationRules, validate, async (req, res) => {
    // console.log(req.body);
    // console.log(`Username: ${req.body.username}`);
    // console.log(`Password: ${req.body.password}`);
    // console.log(`Email: ${req.body.email}`);

    addUser(req, res); //Calling addUser function from middleware/add-user.js
});

//Creating GET endpoint to search for users whose username starts with searchTerm
app.get("/users/:searchTerm", async (req, res) => {
    try {
        const searchTerm = req.params.searchTerm;

        // Search for users with a username that starts with the searchTerm (case-insensitive)
        const users = await User.find({
            username: new RegExp("^" + searchTerm, "i"),
        });

        // Return the search results
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/posts/:postId/like", async (req, res) => {
    try {
        const postId = req.params.postId;
        const username = req.session.username; // Get the username from the session

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const userIndex = post.likes.indexOf(username);

        if (userIndex === -1) {
            // User has not liked the post yet
            post.likes.push(username);
            post.likeCount++;
        } else {
            // User has already liked the post
            post.likes.splice(userIndex, 1);
            post.likeCount--;
        }

        await post.save();

        res.status(200).json({ message: "Like updated successfully", post });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Creating POST endpoint for logging in a user in '/users/login' route
app.post("/login", validate, async (req, res, next) => {
    login(req, res, next); //Calling login function from middleware/login.js
});

//Listening to server at port 3000
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`); //Logging that application is running and on which port
});

//Exporting app for testing
module.exports = app;
