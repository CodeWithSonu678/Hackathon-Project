const mongoose = require("mongoose");

const requestBloodSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    aadharNumber: {
        type: String,
        required: true
    },
    timePeriod: {
        type: String,
        required: true
    },
    bloodGroup: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    hospitals: {
        type: [String],
        required: true
    },
    unit: {
        type: String,
        required: true
    },

    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "donor",
        required: true   
    },

    
    status: {
        type: String,
        enum: ["pending", "accepted", "hospitalSelected", "completed"],
        default: "pending"
    },

   
    selectedHospital: {
        type: String,
        default: ""
    },


    acceptedAt: {
        type: Date,
        default: null
    },
    hospitalSelectedAt: {
        type: Date,
        default: null
    },
    completedAt: {
        type: Date,
        default: null
    }

}, {
    timestamps: true  
});

const requestBloodModel = mongoose.model("requestBlood", requestBloodSchema);

module.exports = requestBloodModel;