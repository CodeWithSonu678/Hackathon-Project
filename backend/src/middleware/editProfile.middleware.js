const { body, validationResult } = require("express-validator");
const userModel = require("../models/user.model");

//Set rules of user
const editProfileMiddleware = [
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
  body("gender")
    .notEmpty().withMessage("Gender is required")
    .isIn(["male", "female", "other"]).withMessage("Invalid gender"),
  body("bloodGroup")
    .notEmpty().withMessage("Blood Group is required")
    .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).withMessage("Invalid blood group"),
  body("address").notEmpty().withMessage("Address is required"),
];

// User Validate
async function validateEditProfile(req, res, next) {
  const error = await validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({
      errors: error.array(),
    });
  }

  next();
}

module.exports = { editProfileMiddleware, validateEditProfile };
