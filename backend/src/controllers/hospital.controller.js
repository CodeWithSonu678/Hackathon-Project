const hospitalModel = require("../models/hospitals.model");

// 🔹 Get all hospital
const getHospitals = async (req, res) => {
  const { district } = req.query;
  
    try {
        const hospitals = await hospitalModel.find({ district:district }).select("-__v");
        res.status(200).json({ success: true, data: hospitals });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🔹 Get district
const getDistrict = async (req, res) => {
    try {
        // distinct se unique data milega
        const allDistricts = await hospitalModel.distinct("district");
        //sort se alphabetically aayega
        res.status(200).json({ success: true, data: allDistricts.sort() });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getHospitals,
    getDistrict
}