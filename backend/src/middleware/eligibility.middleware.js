const { body, validationResult } = require("express-validator");

//Set rules of eligibilty
const eligibiltyRules = [
  body("age")
    .notEmpty()
    .withMessage("Age is required")
    .isBoolean()
    .withMessage("Age should be boolean"),
  body("weight")
    .notEmpty()
    .withMessage("Weight is required")
    .isBoolean()
    .withMessage("Weight should be boolean"),
  body("healthCondition")
    .notEmpty()
    .withMessage("Health condition is required")
    .isBoolean()
    .withMessage("Health condition should be boolean"),
  body("takeMedicine")
    .notEmpty()
    .withMessage("Take medicine is required")
    .isBoolean()
    .withMessage("Take medicine should be boolean"),
  body("lastDonation")
    .optional(),
];

// Eligibility Validate
async function eligibiltyValidate(req, res, next) {
  const errors = await validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
}

module.exports = { eligibiltyRules, eligibiltyValidate };
