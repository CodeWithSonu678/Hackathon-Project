const { searchDonorsService } = require("../services/search.service");
const {getCordination} = require("../utils/geoCoding");

const searchDonors = async (req, res, next) => {
  try {
    const { bloodGroup, city } = req.body;

    const {lat,lng} = await getCordination(city);

    if (!bloodGroup || !lat || !lng) {
      return res.status(400).json({
        success: false,
        msg: "bloodGroup, lat, lng required"
      });
    }

    const donors = await searchDonorsService({ bloodGroup, lat, lng });

    res.status(200).json({
      success: true,
      count: donors.length,
      data: donors
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { searchDonors };