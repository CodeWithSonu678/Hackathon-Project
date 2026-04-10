const mongoose = require("mongoose");

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGODB_URL);

        console.log("DB is connected to successfull");
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = connectDB;