const {body, validationResult} = require("express-validator");

//set rules of review

const reviewRules = [
    body("starInput")
        .notEmpty()
        .withMessage("Star is acceept only number"),
    body("reviewMessage")
        .notEmpty().withMessage("Review message is required")
        .isString().withMessage("Review message should be string"),
];

async function reviewValidate(req,res,next){
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            success:false,
            errors:errors.array()
        });
    }   
    next();
}

module.exports = {reviewRules, reviewValidate};