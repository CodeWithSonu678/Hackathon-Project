const express = require("express");
const userRoute = require("./routes/user.route");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

//midldleware 
app.use(express.json());
app.use(cookieParser());

//hosting ke baad origin mein url dena h taki auothize access na h0
app.use(cors({
  origin: "http://127.0.0.1:5500",
  credentials: true
}));


//Routes

app.use("/api/auth",userRoute);


module.exports = app;