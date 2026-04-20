const service = require("../services/email.service");
const otpStoreModel = require("../models/otpStore.model");
const { generateOtp } = require("../utils/generateOtp");
const userModel = require("../models/user.model");
const bcrypt = require('bcrypt');

// otp send to email
async function sendOtpforgotPass(req, res) {
  const { email } = req.body;

  try {
    const isRegisteredUser = await userModel.findOne({ email: email });

    if (!isRegisteredUser) {
      return res.status(401).json({
        success: false,
        msg: "Registration is required !",
      });
    }

    const isAlreadySentMail = await otpStoreModel.findOne({ email: email });

    const currentTime = Date.now();
    if (isAlreadySentMail && currentTime <= isAlreadySentMail.expiresAt) {
      return res.status(200).json({
        msg: "Otp is already sent !",
        success: false,
      });
    }

    const otp = generateOtp();
    const subject = "Rakht Seva 🔐 OTP Verification";
    const result = service.sendForgotOtp(email, subject, otp);

    const otpSaveInfo = await otpStoreModel.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    res.status(200).json({
      success: true,
      msg: "OTP sent successfully !",
    });
  } catch (error) {
    console.log(error.message);
  }
}

async function verifyOtp(req, res) {
  const { email, userOtp } = req.body;

  const records = await otpStoreModel.findOne({ email });

  if (!records) {
    return res.status(200).json({
      msg: "No otp in your db",
      success: false,
    });
  }

  if (Date.now() > records.expiresAt) {
    return res.status(200).json({
      msg: "Your otp is expired !",
      success: false,
    });
  }

  if (records.otp !== userOtp) {
    return res.status(200).json({
      msg: "Invalid otp !",
      success: false,
    });
  }

  return res.status(200).json({ msg: "Otp verify successful", success: true });
}

//save new password in db
async function saveNewPass(req, res) {
  const { email, newPassword } = req.body;

  const password =await bcrypt.hash(newPassword,10);
  try {
    const records = await userModel.findOne({ email });

    if (!records) {
      return res.status(200).json({
        msg: "Registration is required",
        success: false,
      });
    }

    const info = await userModel.findOneAndUpdate(records._id,{
      password: password,
    },{new:true});

    res.status(201).json({
      success:true,
      msg:"Password changed successfully !"
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = { sendOtpforgotPass, verifyOtp,saveNewPass };
