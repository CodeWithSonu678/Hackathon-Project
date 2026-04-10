const mongoose= require("mongoose");

const userSchema = new mongoose.Schema({
      username:{
        type:String,
        required:true
      },
      dob:{
        type:Date,
        required:true
      },
      mobileNumber:{
        type:String,
        required:true,
        unique:true,
        length:10
       },
       email:{
        type:String,
        required:true,
        unique:true
       },
       aadharNumber:{
        type:String,
        required:true,
        unique:true,
        length:12
       },
       gender:{
        type:String,
        required:true,
        enum:["male","female","other"]
       },
       bloodGroup:{
        type:String,
        required:true,
        enum:["A+","A-","B+","B-","AB+","AB-","O+","O-"]
       },
       address:{
        type:String,
        required:true
       },
       pinCode:{
        type:String,
        required:true,
        length:6
       },
       password:{
        type:String,
        required:true
       }
});

const userModel = mongoose.model("user",userSchema);

module.exports = userModel;