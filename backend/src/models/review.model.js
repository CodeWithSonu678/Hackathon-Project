const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    reviewMessage:{
        type:String,
        required:true
    },
    user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
            required:true
    },
    rating:{
        type:Number,
        min:1,
        max:5
    }
},{timestamps:true});

const reviewModel = mongoose.model("review",reviewSchema);

module.exports = reviewModel;