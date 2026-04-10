const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    donorName:{
        type:String,
        required:true,
    },
    mobileNumber:{
        type:String,
        required:true,
        unique:true,
        length:10
    },
    age:{
        type:String,
        required:true
    },
    bloodGroup:{
        type:String,
        required:true,
        enum:["A+","A-","B+","B-","AB+","AB-","O+","O-"]
    },
    lastDonationDate:{
        type:Date,
        optional:true
    },
    city:{
        type:String,
        required:true
    },
    location:{
        type:{
            type:String,
            enum:["Point"],
            default:"Point"
        },
        coordinates:{
            type:[Number], //[lng,lat]
            required:true
        }
    }

},{timestamps:true});

donorSchema.index({location:"2dsphere"});

const donorModel =  mongoose.model("donor",donorSchema);

module.exports=donorModel;