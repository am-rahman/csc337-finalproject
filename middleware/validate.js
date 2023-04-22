const { validationResult } = require("express-validator");

async function validate(req, res, next) {
    const errors = validationResult(req);
    console.log("validate called");
    if (!errors.isEmpty()) {
        console.log("validation errors:", errors.array());
        return res.status(422).json({ errors: errors.array() });
    }
    next();
}

module.exports = validate;
