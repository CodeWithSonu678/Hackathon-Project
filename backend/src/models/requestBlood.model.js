const mongoose = require("mongoose");

const requestBloodSchema = new mongoose.Schema({
    patientName:{
        type:String,
        required:true
    },
    age:{
        type:String,
        required:true
    },
    aadharNumber:{
        type:String,
        required:true,
        unique:true
    },
    timePeriod:{
        type:String,
        required:true
    },
    bloodGroup:{
        type:String,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    hospitals:{
        type:[String],
        required:true
    },
    unit:{
        type:String,
        required:true
    },
    donor:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"donor"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"user"
    }
});

const requestBloodModel = mongoose.model("requestBlood",requestBloodSchema);

module.exports = requestBloodModel;