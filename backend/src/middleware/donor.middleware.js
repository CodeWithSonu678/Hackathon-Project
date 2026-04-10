  const {body,validationResult} = require("express-validator");

//Set rules of donor
const donorRules = [
    body("donorName")
        .notEmpty().withMessage("Name is required")
        .isString().withMessage("Name should be string"),
    body("mobileNumber")
        .notEmpty().withMessage("Mobile Number is required")
        .isLength({min:10, max:10}).withMessage("Mobile number must be 10 digits")
        .isNumeric().withMessage("Mobile number must contain only number"),
    body("age")
        .notEmpty().withMessage("Age is required")
        .isNumeric().withMessage("Age must be a number"),
    body("bloodGroup")
    .notEmpty().withMessage("Blood Group is required")
    .isIn(["A+","A-","B+","B-","AB+","AB-","O+","O-"]).withMessage("Invalid blood group"),
    body("lastDonation")
        .isBoolean().withMessage("lastDonation must be true and false"),
    body("lastDonationDate")
        .if(body("lastDonation").equals(true))
        .notEmpty().withMessage("Last Donation Date is required")
        .isISO8601().withMessage("Invalid data format"),
    body("city")
        .notEmpty().withMessage("City is required")

]

function donorValidate(req,res,next){
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            success:false,
            errors:errors.array()
        });
    }

    next();
}

module.exports = { donorRules, donorValidate };