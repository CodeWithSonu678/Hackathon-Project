const donorModel = require("../models/donor.model");

const searchDonorsService = async ({ bloodGroup, lat, lng }) => {

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error("Invalid coordinates");
  }


  const donors = await donorModel.aggregate([
  {
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [longitude, latitude]
      },
      distanceField: "distance",
      maxDistance: 50000,
      spherical: true
    }
  },
  {
    $addFields: {
      distanceInKm: { $divide: ["$distance", 1000] }
    }
  }
]);

  const result = donors.filter(d => {
    return (
      d.bloodGroup &&
      bloodGroup &&
      d.bloodGroup.trim().toUpperCase() === bloodGroup.trim().toUpperCase()
    );
  });

  return result;
};

module.exports = { searchDonorsService };