const jwt = require("jsonwebtoken");
const donorModel = require("../models/donor.model");
async function isAlreadyReg(req,res,next){
    // const token = req.cookies.token;

    // console.log(token);
    
    // if(!token){
    //     return res.status(401).json({
    //         msg:"Registration/Login is required",
    //         success:false
    //     })
    // }

    let token;

    // 1️⃣ check Authorization header
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2️⃣ check cookies
    if (!token && req.cookies.token) {
      token = req.cookies.token;
    }

    // 3️⃣ no token
    if (!token) {
      return res.status(401).json({ msg: "Login required" });
    }

    console.log("SECRET:", process.env.SECRET_KEY);

    try {
        const decoded = jwt.verify(token,process.env.SECRET_KEY);

        req.user = decoded;

        next();
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({
            msg:"Unauthorized access",
            success:false
        })
    }
}

module.exports = {isAlreadyReg};