const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const addUser = require("../middleware/add-user");
const validate = require("../middleware/validate");

router.post("/create", addUser, async (req, res) => {
    const { username, password, email } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username: username,
        password: hashedPassword,
        email: email,
    });

    try {
        await user.save();
        res.status(201).send("User created successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
