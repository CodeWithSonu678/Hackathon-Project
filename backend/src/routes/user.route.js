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
const {reqBloodControlle,requestReject,requestAccept} = require("../controllers/requestBlood.controller");
const hospitalControlller = require("../controllers/hospital.controller");
const {editProfileMiddleware, validateEditProfile} = require("../middleware/editProfile.middleware");
const forgotController = require('../controllers/forgotPass.controller');

const Hospital = require("../models/hospitals.model");

const router = express.Router();

//user registration, login and logout
router.post("/register", regUserMiddleware, validateRegUser,userController.userRegister);
router.post("/login", loginUserMiddleware, validateLoginUser,userController.userLogin);
router.get("/logout",userController.logoutController);

//forgot Password
router.post("/send-otp",forgotController.sendOtpforgotPass);
router.post("/verify-otp",forgotController.verifyOtp);
router.post("/forgot-password",forgotController.saveNewPass);



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
router.post("/edit-user-info",isAlreadyReg,editProfileMiddleware, validateEditProfile,userController.editDashboard)


//fetch hospital list
router.get("/hospitals",hospitalControlller.getHospitals);

//fetch district list
router.get("/districts",hospitalControlller.getDistrict);

//fetch all request
router.get("/all-request-outgoing",isAlreadyReg,userController.fetchAllRequest);
router.get("/all-request-incoming",isAlreadyReg,userController.fetchAllRequestByUser);

//if donor reject request then change status in db
router.patch("/reject/:id",isAlreadyReg,requestReject);
//if donor accept request then change status in db
router.patch("/accept/:id",isAlreadyReg,requestAccept);

router.get("/all-incoming-recent",isAlreadyReg,userController.incomingRecent);



module.exports = router;