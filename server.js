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
} = require("./config");
const app = express();
const port = 3000;

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

// /**
//  * Code for svelte
//  */

// app.use(cors());

//Serving static files from public_html folder using Express.static
app.use(express.static(path.join(__dirname, "public_html")));

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public_html", "login.html"));
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

//TODO: delete later
// const userCreateValidationRules = [
//         ...userValidationRules,
//     // Email validation
//     check("email")
//         .isEmail()
//         .withMessage("Invalid email format")
//         .normalizeEmail(),
// ];

//TODO: Add validation rules for post
const postValidationRules = [
    check("postBody")
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage("Post must be between 1 and 200 characters long"),
];

//Creating POST endpoint to add a new post in '/posts' route
app.post("/posts/add", async (req, res) => {
    const post = new Post({
        user: req.body.user,
        body: req.body.body,
    });
    try {
        const savedPost = await post.save();
        res.setHeader("Content-Type", "application/json");
        res.status(201).send(JSON.stringify(savedPost.toJSON()));
    } catch (err) {
        res.status(500).send(err); //If error occurs, sending Internal Server Error and the error itself
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
