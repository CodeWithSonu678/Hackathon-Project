const requestBloodModel = require("../models/requestBlood.model");
const donorModel = require("../models/donor.model");
const userModel = require("../models/user.model");
const { sendRequestMailDonor } = require("../services/email.service");

//create request 
async function reqBloodControlle(req, res) {
  const {
    patientName,
    age,
    aadharNumber,
    timePeriod,
    bloodGroup,
    district,
    hospitals,
    unit,
    donorId,
  } = req.body;

  const donordata = await donorModel.findById(donorId);

  if (!donordata) {
    return res.status(404).json({
      success: false,
      msg: "Donor not found !",
    });
  }

  try {
    const patient = await requestBloodModel.create({
      patientName,
      age,
      aadharNumber,
      timePeriod,
      bloodGroup,
      district,
      hospitals,
      unit,
      donor: donorId,
      user: req.user.id,
    });

    const donorinfo = await donorModel.findById(donorId).populate("user", "email");
    const donorEmail = donorinfo.user.email;

    const userinfo = await userModel.findById(req.user.id).select("email mobileNumber");
    const pateintEmail = userinfo.email;
    const phone = userinfo.mobileNumber;

    
    const info = sendRequestMailDonor(
      pateintEmail,
      donorEmail,
      patientName,
      bloodGroup,
      district,
      phone,
      timePeriod,
    );

    res.status(201).json({
      success: true,
      msg: "Your request successfully send to donor",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: error.message || "Server error",
    });
  }
}

//if donor reject request
async function requestReject(req,res){
  const {id} = req.params;

  try {
    const info = await requestBloodModel.findByIdAndUpdate(id,{
      status:"rejected"
    },{new:true});

    res.status(200).json({
      success:true,
      msg:"Request rejected successfull !"
    });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      success:false,
      msg:"Server error !"
    })
  }

}

//if donor accept request
async function requestAccept(req,res){
  const {id} = req.params;

  try {
    const info = await requestBloodModel.findByIdAndUpdate(id,{
      status:"accepted"
    },{new:true});

    res.status(200).json({
      success:true,
      msg:"Request accepted successfull !"
    });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      success:false,
      msg:"Server error !"
    })
  }

}



module.exports = { reqBloodControlle,requestReject,requestAccept };
