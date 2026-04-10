const { body, validationResult } = require("express-validator");
const userModel = require("../models/user.model");

//Set rules of user
const regUserMiddleware = [
  body("username").notEmpty().withMessage("Username is required"),
  body("dob")
    .notEmpty().withMessage("Date of birth is required")
    .isDate().withMessage("DOB shoud be date"),
  body("mobileNumber")
    .notEmpty().withMessage("Mobile Number is required")
    .isLength({min:10, max:10}).withMessage("Mobile number must be 10 digits")
    .isNumeric().withMessage("Mobile number must contain only number"),
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email should be valid"),
  body("aadharNumber")
    .notEmpty().withMessage("Aadhar is required")
    .isLength({ min: 12, max: 12 }).withMessage("Aadhar must be 12 digits")
    .isNumeric().withMessage("Aadhar must contain only numbers"),
  body("gender")
    .notEmpty().withMessage("Gender is required")
    .isIn(["male", "female", "other"]).withMessage("Invalid gender"),
  body("bloodGroup")
    .notEmpty().withMessage("Blood Group is required")
    .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).withMessage("Invalid blood group"),
  body("address").notEmpty().withMessage("Address is required"),
  body("pinCode")
    .notEmpty().withMessage("Pin Code is required")
    .isLength({ min: 6, max: 6 }).withMessage("Pin Code must be 6 digits")
    .isNumeric().withMessage("Pin code must contain only number"),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password should be at least 6 characters long"),
];

// User Validate
async function validateRegUser(req, res, next) {
  const error = await validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({
      errors: error.array(),
    });
  }

  next();
}

//set rules of User login
const loginUserMiddleware = [
  body("mobileNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .isNumeric()
    .withMessage("Phone number should be numeric")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number is must be 10 number"),
  body("password").notEmpty().withMessage("Password is required"),
];

//Validate of User login
async function validateLoginUser(req, res, next) {
  const errors = await validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  next();
}

module.exports = {
  regUserMiddleware,
  validateRegUser,
  loginUserMiddleware,
  validateLoginUser,
};
