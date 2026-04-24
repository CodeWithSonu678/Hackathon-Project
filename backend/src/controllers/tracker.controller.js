const requestBloodModel = require("../models/requestBlood.model");
const donorModel = require("../models/donor.model");
const userModel = require("../models/user.model");
const {
  sendToDonorDCode,
  sendToPatientDCode,
} = require("../services/email.service");
const { generateOtp } = require("../utils/generateOtp");

//selected hospital save in db
async function updateHospital(req, res) {
  const { selectHospital } = req.body;
  const { id } = req.params;

  console.log(selectHospital, id);
  console.log(req.body);

  try {
    const info = await requestBloodModel.findByIdAndUpdate(
      id,
      {
        selectedHospital: selectHospital,
        hospitalSelectedAt: new Date(),
        status: "confirmed",
      },
      { returnDocument: "after" } ,
    );

    res.status(201).json({
      success: true,
      msg: "hospital selected successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      msg: "Server Error",
    });
  }
}

//contact details save in db
async function updateContact(req, res) {
  const { donationDate } = req.body;
  const { id } = req.params;

  try {
    const info = await requestBloodModel.findByIdAndUpdate(
      id,
      {
        donationDate: donationDate,
        contactedAt: new Date(),
        status: "contacted",
      },
      { returnDocument: "after" } ,
    );

    res.status(201).json({
      success: true,
      msg: "Contacted step successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      msg: "Server Error",
    });
  }
}

//Donation Code save in db
// async function updateDonationCode(req, res) {
//   const { dCode } = req.body;
//   const { id } = req.params;

//   try {
//     const info = await requestBloodModel.findByIdAndUpdate(
//       id,
//       {
//         donationCode: dCode,
//         status: "completed",
//       },
//       { returnDocument: "after" } ,
//     );

//     res.status(201).json({
//       success: true,
//       msg: "Thank You, For donate blood..",
//     });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({
//       success: false,
//       msg: "Server Error",
//     });
//   }
// }

//donor send to patient
async function codeSendToDonor(req, res) {
  const { patientEmail} = req.body;
  const { id } = req.params;
  if (!patientEmail) {
    return res.status(200).json({
      success: false,
      msg: "Patient email is not found !",
    });
  }

    try {
    const data = await requestBloodModel.findById(id);

    const diff = Date.now() - new Date(data.contactedAt);
    const hours = diff / (1000 * 60 * 60);

    if (hours < 24) {
      return res.json({
        success: false,
        msg: "Send code after 24 hours",
      });
    }

    const code = generateOtp();

    await sendToDonorDCode(patientEmail, "Rakht Seva, Donation Code", code);

    await requestBloodModel.findByIdAndUpdate(id, {
      patientDonationCode: code,
      donorCodeSent: true,
    });

    res.json({
      success: true,
      msg: "Donation Code sent to patient ✅",
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, msg: "Server error" });
    }
}



async function codeSendToPatient(req, res) {
  const { donorEmail } = req.body;
  const { id } = req.params;

  if (!donorEmail) {
    return res.json({ success: false, msg: "Donor email not found!" });
  }

  try {
    const data = await requestBloodModel.findById(id);

    const diff = Date.now() - new Date(data.contactedAt);
    const hours = diff / (1000 * 60 * 60);

    if (hours < 24) {
      return res.json({
        success: false,
        msg: "Send code after 24 hours",
      });
    }

    const code = generateOtp();

    await sendToPatientDCode(donorEmail, "Rakht Seva, Donation Code", code);

    await requestBloodModel.findByIdAndUpdate(id, {
      donorDonationCode: code,
      patientCodeSent: true 
    });

    res.json({
      success: true,
      msg: "Donation Code sent to donor ✅",
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
}


async function verifyDonationCode(req, res) {
  const { id } = req.params;
  const { role, donationCode } = req.body;

  try {
    const data = await requestBloodModel.findById(id);

    if (!data) {
      return res.json({ success: false, msg: "Request not found ❌" });
    }

    //  role ke hisaab se verify
    if (role === "donor") {
      if (donationCode !== data.patientDonationCode) {
        return res.json({ success: false, msg: "Invalid code ❌" });
      }
      data.donorVerified = true;
    }

    if (role === "patient") {
      if (donationCode !== data.donorDonationCode) {
        return res.json({ success: false, msg: "Invalid code ❌" });
      }
      data.patientVerified = true;
    }

    //  dono verify ho gaye → completed
    if (data.donorVerified && data.patientVerified) {
      data.status = "completed";
    }

    await data.save();

    res.json({
      success: true,
      msg: "Code verified ✅",
      status: data.status
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
}

module.exports = {
  updateHospital,
  updateContact,
  verifyDonationCode,
  codeSendToDonor,
  codeSendToPatient,
};
