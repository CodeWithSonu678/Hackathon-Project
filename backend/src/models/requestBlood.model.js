const mongoose = require("mongoose");

const requestBloodSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    aadharNumber: {
      type: String,
      required: true,
    },
    timePeriod: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    hospitals: {
      type: [String],
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "donor",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "confirmed",
        "contacted",
        "completed",
        "rejected",
      ],
      default: "pending",
    },
    selectedHospital: {
      type: String,
      default: "",
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
    contactedAt: {
      type: Date,
      deafult: null,
    },
    hospitalSelectedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    donationDate: {
      type: Date,
      default: null,
    },
    donorVerified: {
      type: Boolean,
      default: false,
    },
    patientVerified: {
      type: Boolean,
      default: false,
    },
    donorCodeSent: {
      type: Boolean,
      default: false,
    },
    patientCodeSent: {
      type: Boolean,
      default: false,
    },
    donorDonationCode: {
      type: String,
      default: "",
    },
    patientDonationCode: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const requestBloodModel = mongoose.model("requestBlood", requestBloodSchema);

module.exports = requestBloodModel;
