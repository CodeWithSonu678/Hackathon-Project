const express = require("express");
const { regUserMiddleware, validateRegUser,loginUserMiddleware,validateLoginUser } = require("../middleware/user.middleware");
const {eligibiltyRules,eligibiltyValidate} = require("../middleware/eligibility.middleware");
const userController = require("../controllers/user.controller");
const elgiControlller = require("../controllers/eligibility.controller");
const {isAlreadyReg} = require("../middleware/isAlreadyReg");
const {donorRules,donorValidate} = require("../middleware/donor.middleware");
const {donorController} = require("../controllers/donor.controller");
const {searchDonors} = require("../controllers/search.controller");
const {reviewController,getAllReviews} = require("../controllers/review.controller");
const {reviewRules, reviewValidate} = require("../middleware/review.middleware");
const {reqBloodRules, reqBloodValidation} = require("../middleware/reqBlood.middleware");
const {reqBloodControlle} = require("../controllers/requestBlood.controller");
const hospitalControlller = require("../controllers/hospital.controller");

const Hospital = require("../models/hospitals.model");

const router = express.Router();

//user registration, login and logout
router.post("/register", regUserMiddleware, validateRegUser,userController.userRegister);
router.post("/login", loginUserMiddleware, validateLoginUser,userController.userLogin);
router.get("/logout",userController.logoutController);

//check eligibility
router.post("/eligibility", eligibiltyRules, eligibiltyValidate,elgiControlller.eligibiltyController);

//donor registration
router.post("/donate-form",isAlreadyReg,donorRules,donorValidate,donorController);

//search donors
router.post("/donor",searchDonors);

//reviews
router.post("/review",isAlreadyReg,reviewRules,reviewValidate,reviewController)
router.get("/reviews",getAllReviews);

//request blood
router.post("/request-blood",isAlreadyReg,reqBloodRules,reqBloodValidation,reqBloodControlle);

//fetch user info for dashboard
router.get("/get-user-info",isAlreadyReg,userController.fetchDashboard)

//fetch hospital list
router.get("/hospitals",hospitalControlller.getHospitals);

//fetch district list
router.get("/districts",hospitalControlller.getDistrict);

//fetch all request
router.get("/all-request",isAlreadyReg,userController.fetchAllRequest);



module.exports = router;