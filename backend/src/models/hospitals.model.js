const mongoose = require("mongoose")

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lon: {
        type: Number,
        required: true
    }

});

const hospitalModel = mongoose.model("hospital", hospitalSchema);

module.exports = hospitalModel;