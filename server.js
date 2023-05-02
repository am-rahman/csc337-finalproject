//Importing required libraries and modules
const express = require("express"); //Express is a web framework for building APIs
const mongoose = require("mongoose"); //Mongoose helps to work with MongoDB more easily
const bodyParser = require("body-parser"); //Body-parser is used to extract the entire body portion of an incoming request stream
const path = require("path"); //Path is used to work with file and directory paths
const { check } = require("express-validator"); //Express-validator is used to validate the input
const validate = require("./middleware/validate"); //Custom middleware to validate the input
const session = require("express-session"); //Express-session is used to create a session middleware
const crypto = require("crypto");
const login = require("./middleware/login"); //Custom middleware to handle user login
const cors = require("cors"); //CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

const app = express();
const port = 3000;

//Connecting to a MongoDB database 'chatter'
mongoose.connect("mongodb://127.0.0.1:27017/chatter", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//Storing the schemas for User and Post
const User = require("./models/user");
const Post = require("./models/post");

//Using body-parser to extract the entire body portion of an incoming request stream
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Using express-session to create a session middleware
const sessionSecret = crypto.randomBytes(32).toString("hex");
app.use(
    session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: true,
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

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public_html', 'login.html'));
});

app.get('/create', (req, res) => {
    res.sendFile(path.join(__dirname, 'public_html', 'create-account.html'));
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
        res.setHeader('Content-Type', 'application/json');
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
const addUser = require("./middleware/add-user"); //Importing addUser function from middleware/add-user.js
app.post("/users/add", userValidationRules, validate, async (req, res) => {
    // console.log(req.body);
    // console.log(`Username: ${req.body.username}`);
    // console.log(`Password: ${req.body.password}`);
    // console.log(`Email: ${req.body.email}`);

    addUser(req, res); //Calling addUser function from middleware/add-user.js
});

//Creating POST endpoint for logging in a user in '/users/login' route
app.post("/login", validate, async (req, res) => {
    login(req, res); //Calling login function from middleware/login.js
});

//Listening to server at port 3000
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`); //Logging that application is running and on which port
});

//Exporting app for testing
module.exports = app;
