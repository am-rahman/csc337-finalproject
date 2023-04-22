const { validationResult } = require("express-validator");
const sanitize = require("mongo-sanitize");

/**
 * validates and sanitizes the user input.
 * @param {*} req the request object
 * @param {*} res the response object
 * @param {*} next the next middleware function
 * @returns
 */
async function validate(req, res, next) {
    //Sanitize the request body to prevent NoSQL injection
    req.body = await sanitize(req.body);

    const errors = validationResult(req);
    console.log("validate called");
    if (!errors.isEmpty()) {
        console.log("validation errors:", errors.array());
        return res.status(422).json({ errors: errors.array() });
    }
    next();
}

module.exports = validate;
