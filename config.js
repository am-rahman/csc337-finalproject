//Importing required libraries and modules
const express = require("express"); //Express is a web framework for building APIs
const mongoose = require("mongoose"); //Mongoose helps to work with MongoDB more easily
const bodyParser = require("body-parser"); //Body-parser is used to extract the entire body portion of an incoming request stream
const path = require("path"); //Path is used to work with file and directory paths
const { check } = require("express-validator"); //Express-validator is used to validate the input
const session = require("express-session"); //Express-session is used to create a session middleware
const crypto = require("crypto");
const login = require("./middleware/login"); //Custom middleware to handle user login
const MongoStore = require("connect-mongo"); //MongoStore is used to store session data in MongoDB

const validate = require("./middleware/validate"); //Custom middleware to validate the input
const addUser = require("./middleware/add-user"); //Custom middleware to create a new user in the database

const User = require("./models/user");
const Post = require("./models/post");

require("dotenv").config();
const DB_URL = process.env.DB_URL;
const SECRET = process.env.SECRET;
const PORT = process.env.PORT;
const DB_NAME = process.env.DB_NAME;
const SESSION_STORE = process.env.SESSION_STORE;

module.exports = {
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
};
