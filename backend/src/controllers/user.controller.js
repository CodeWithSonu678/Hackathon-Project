const userModel = require("../models/user.model");
const requestModel = require("../models/requestBlood.model");
const donorModel = require("../models/donor.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//User Registration
async function userRegister(req, res) {
  const {
    username,
    dob,
    mobileNumber,
    email,
    aadharNumber,
    gender,
    bloodGroup,
    address,
    pinCode,
    password
  } = req.body;

  const existingUser = await userModel.findOne({
  $or: [{ email }, { mobileNumber },{aadharNumber}]
});

if (existingUser) {
  if (existingUser.email === email) {
    return res.status(409).json({ msg: "Email already registered", success:false });
  }

  if (existingUser.mobileNumber === mobileNumber) {
    return res.status(409).json({ msg: "Mobile Number already exist",success:false });
  }

  if (existingUser.aadharNumber === aadharNumber) {
    return res.status(409).json({ msg: "Aadhar Number already",success:false });
  }
}
  const hashPassword = await bcrypt.hash(password,10);
  const user = await userModel.create({
    username,
    dob,
    mobileNumber,
    email,
    aadharNumber,
    gender,
    bloodGroup,
    address,
    pinCode,
    password:hashPassword
  });

  res.status(201).json({
    msg:"User registered successfull",
    success:true
  });
}

//User Login
async function userLogin(req,res){
  const {mobileNumber,password} = req.body;

  const user = await userModel.findOne({mobileNumber:mobileNumber});

  if(!user){
    return res.status(401).json({
      msg:"Invalid Credentails",
      success:false
    });
  }

  const isValidPassword = await bcrypt.compare(password,user.password);

  if(!isValidPassword){
    return res.status(401).json({
      msg:"Invalid Password",
      success:false
    });
  }

  const token = jwt.sign({
    id : user._id,
    email:user.email
  },process.env.SECRET_KEY);

res.cookie("token", token, {
  httpOnly: true,   
  sameSite: "lax",
  secure: false        
});


  res.status(200).json({
    msg:"User logined successfull",
    success:true
  })
}

//user logout btn click then cookies delete
function logoutController(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/"
  });

  console.log(req.cookies.token)
  return res.status(200).json({
    success: true,
    msg: "Logout successful"
  });
}

//Dashboard Data fetch
async function fetchDashboard(req,res) {
  const userId = req.user.id;

  const userData = await userModel.findOne({_id:userId}).select("-password -__v");

  res.status(200).json({
    success:true,
    msg:"User Fetch is successfull",
    userData
  })
}

//fetch all request
async function fetchAllRequest(req, res) {
  const userId = req.user.id;

  const allRequest = await requestModel
    .find({ user: userId })
    .populate("donor",'donorName mobileNumber age bloodGroup city');

  res.status(200).json({
    success: true,
    msg: "All Request Fetch is successful",
    allRequest
  });
}
module.exports = {userRegister,userLogin,logoutController,fetchDashboard,fetchAllRequest};