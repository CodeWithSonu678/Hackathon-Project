const donorModel = require("../models/donor.model");
const { getCordination } = require("../utils/geoCoding");


async function donorController(req, res) {
  const {
    donorName,
    mobileNumber,
    age,
    bloodGroup,
    lastDonation,
    lastDonationDate,
    city,
  } = req.body;

  const { lat, lng } = await getCordination(city);

  const isAlreadyDonor = await donorModel.findOne({ user: req.user.id });

  if (isAlreadyDonor) {
    return res.status(400).json({
      msg: "You are already donor",
      success: false,
    });
  }

  try {
    const donor = await donorModel.create({
      donorName: donorName.toLowerCase(),
      mobileNumber,
      age,
      bloodGroup: bloodGroup.toUpperCase(),
      city: city.toLowerCase(),
      lastDonation,
      lastDonationDate: lastDonation ? lastDonationDate : null,
      user: req.user.id,
      location: {
        type: "Point",
        coordinates: [Number(lng), Number(lat)],
      },
    });

    res.status(201).json({
      msg: "Donation registered successfully 🩸",
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      msg: "Problem in DB",
      success: false,
      error: error.message,
    });
  }
}

module.exports = { donorController };
