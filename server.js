//Importing required libraries and modules
const express = require("express"); //Express is a web framework for building APIs
const mongoose = require("mongoose"); //Mongoose helps to work with MongoDB more easily
const bodyParser = require("body-parser"); //Body-parser is used to extract the entire body portion of an incoming request stream
const path = require("path"); //Path is used to work with file and directory paths
const { check } = require("express-validator"); //Express-validator is used to validate the input
const sanitize = require("mongo-sanitize"); //Mongo-sanitize is used to sanitize the input
const validate = require("./middleware/validate"); //Custom middleware to validate the input

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Using express-validator to validate the input
const userValidationRules = [
    check("username")
        .trim()
        .isLength({ min: 5, max: 20 })
        .withMessage("Username must be between 5-20 characters long"),

    check("password")
        .trim()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long"),

    check("email")
        .trim()
        .isEmail()
        .withMessage("Email must be a valid email address"),
];

//TODO: Add validation rules for post
const postValidationRules = [
    check("postBody")
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage("Post must be between 1 and 200 characters long"),
];

//Using mongo-sanitize to sanitize the input
app.use((req, res, next) => {
    req.body = sanitize(req.body);
    next();
});

//Serving static files from public_html folder using Express.static
app.use(express.static(path.join(__dirname, "public_html")));

//Creating POST endpoint to add a new post in '/posts' route
app.post("/posts/add", async (req, res) => {
    const post = new Post({
        //Creating a new Post object
        user: req.body.user,
        body: req.body.body,
    });
    try {
        const savedPost = await post.save(); //Saving Post in the database
        res.status(201).send(savedPost); //Sending success status and the savedPost data
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
    console.log(req.body);
    // console.log(`Username: ${req.body.username}`);
    // console.log(`Password: ${req.body.password}`);
    // console.log(`Email: ${req.body.email}`);

    addUser(req, res); //Calling addUser function from middleware/add-user.js
});

//Listening to server at port 3000
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`); //Logging that application is running and on which port
});

//Exporting app for testing
module.exports = app;
