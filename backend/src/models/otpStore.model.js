const mongoose = require("mongoose");

const otpStoreSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    expiresAt:{
        type:Date,
        required:true
    }
},{
    timestamps:true
});

//auto delete at expires
otpStoreSchema.index({expiresAt:1},{expireAfterSeconds:0});

const otpStoreModel = mongoose.model("otp",otpStoreSchema);

module.exports=otpStoreModel;