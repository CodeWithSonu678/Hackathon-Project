const {body,validationResult} = require("express-validator");

//set rules of req data

const reqBloodRules =[
    body("patientName").notEmpty().withMessage("Patient name is required"),
    body("age").notEmpty().withMessage("Age is required"),
    body("aadharNumber").notEmpty().withMessage("Aadhar number is required").isNumeric().withMessage("Aadhar number must be numeric").isLength({min:12,max:12}).withMessage("Aadhar number must be 12 digits"),
    body("timePeriod").notEmpty().withMessage("Time period is required"),
    body("bloodGroup").notEmpty().withMessage("Blood group is required").isIn(["A+","A-","B+","B-","AB+","AB-","O+","O-"]).withMessage("Invalid blood group"),
    body("timePeriod").notEmpty().withMessage("Time period is required"),
    body("unit").notEmpty().withMessage("Unit is required").isNumeric().withMessage("Unit must be numeric")
];

//validation of req data

const reqBloodValidation = (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){ 
        return res.status(400).json({
            success:false,
            errors:errors.array()
        });
    }
    next();
}

module.exports = {reqBloodRules,reqBloodValidation};