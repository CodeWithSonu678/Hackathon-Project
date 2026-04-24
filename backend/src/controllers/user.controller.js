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
    password,
  } = req.body;

  const existingUser = await userModel.findOne({
    $or: [{ email }, { mobileNumber }, { aadharNumber }],
  });

  if (existingUser) {
    if (existingUser.email === email) {
      return res
        .status(409)
        .json({ msg: "Email already registered", success: false });
    }

    if (existingUser.mobileNumber === mobileNumber) {
      return res
        .status(409)
        .json({ msg: "Mobile Number already exist", success: false });
    }

    if (existingUser.aadharNumber === aadharNumber) {
      return res
        .status(409)
        .json({ msg: "Aadhar Number already", success: false });
    }
  }
  const hashPassword = await bcrypt.hash(password, 10);
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
    password: hashPassword,
  });

  res.status(201).json({
    msg: "User registered successfull",
    success: true,
  });
}

//User Login
async function userLogin(req, res) {
  const { mobileNumber, password } = req.body;

  const user = await userModel.findOne({ mobileNumber: mobileNumber });

  if (!user) {
    return res.status(401).json({
      msg: "Invalid Credentails",
      success: false,
    });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(401).json({
      msg: "Invalid Password",
      success: false,
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.SECRET_KEY,
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
  });

  res.status(200).json({
    msg: "User logined successfull",
    token,
    success: true,
    user,
  });
}

//user logout btn click then cookies delete
function logoutController(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });

  return res.status(200).json({
    success: true,
    msg: "Logout successful",
  });
}

//Dashboard Data fetch
async function fetchDashboard(req, res) {
  const userId = req.user.id;

  const userData = await userModel
    .findOne({ _id: userId })
    .select("-password -__v");

  res.status(200).json({
    success: true,
    msg: "User Fetch is successfull",
    userData,
  });
}

async function editDashboard(req, res) {
  const {
    username,
    age,
    email,
    mobileNumber,
    dob,
    gender,
    bloodGroup,
    address,
  } = req.body;

  userId = req.user.id;

  const updateInfo = await userModel.findByIdAndUpdate(
    userId,
    {
      username,
      age,
      email,
      mobileNumber,
      dob,
      gender,
      bloodGroup,
      address,
    },
    { new: true },
  );

  res.status(201).json({
    msg: "Profile updated successfully !",
    success: true,
  });
}

//fetch all request by me
async function fetchAllRequest(req, res) {
  const userId = req.user.id;

  const allRequest = await requestModel
    .find({ user: userId })
    .populate({
      path: "donor",
      select: "donorName mobileNumber age bloodGroup city user",
      populate: {
        path: "user",
        select: "username email mobileNumber",
      },
    })
    .populate("user", "username mobileNumber age bloodGroup address");

  res.status(200).json({
    success: true,
    msg: "By me, All Request Fetch is successful",
    allRequest,
  });
}

//fetch all request in panding by user
async function fetchAllRequestByUser(req, res) {
  const userId = req.user.id;

  const donorInfo = await donorModel.findOne({ user: userId });
  if (!donorInfo) {
    return res.status(200).json({
      success: false,
      data: [],
    });
  }
  const allRequest = await requestModel
    .find({ donor: donorInfo._id, status: "pending" })
    .populate({
      path: "donor",
      select: "donorName mobileNumber age bloodGroup city user",
      populate: {
        path: "user",
        select: "username email mobileNumber",
      },
    })
    .populate("user", "username mobileNumber age bloodGroup address");

  res.status(200).json({
    success: true,
    msg: "By user, All Request Fetch is successful",
    allRequest,
  });
}

//fetch all recent request by user(incoming)
async function incomingRecent(req, res) {
  const userId = req.user.id;

  try {
    const donorInfo = await donorModel.findOne({ user: userId });
    if (!donorInfo) {
      return res.status(200).json({
        success: false,
        data: [],
      });
    }
    const allIncomingRecent = await requestModel
      .find({
        donor: donorInfo._id,
        status: { $in: ["accepted", "rejected","confirmed","contacted","completed"] },
      })
      .populate({
        path: "donor",
        select: "donorName mobileNumber age bloodGroup city user",
        populate: {
          path: "user",
          select: "username email mobileNumber",
        },
      })
      .populate("user", "username mobileNumber email age bloodGroup address")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      msg: "By user, All Request Rejected & Accepted Fetch is successful",
      data: allIncomingRecent,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      msg: "server error !",
    });
  }
}

//fetch all recent request by me(outcoming)
async function outcomingRecent(req, res) {
  const userId = req.user.id;

  try {
    const allOutcomingRecent = await requestModel
      .find({
        user: userId,
        status: { $in: ["accepted", "rejected","confirmed","contacted","completed"] },
      })
      .populate({
        path: "donor",
        select: "donorName mobileNumber age bloodGroup city user",
        populate: {
          path: "user",
          select: "username email mobileNumber",
        },
      })
      .populate("user", "username mobileNumber age email bloodGroup address")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      msg: "By me, All Request Rejected & Accepted Fetch is successful",
      data: allOutcomingRecent,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      msg: "server error !",
    });
  }
}

module.exports = {
  userRegister,
  userLogin,
  logoutController,
  fetchDashboard,
  editDashboard,
  fetchAllRequest,
  fetchAllRequestByUser,
  incomingRecent,
  outcomingRecent,
};
