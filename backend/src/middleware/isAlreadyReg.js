const jwt = require("jsonwebtoken");
const donorModel = require("../models/donor.model");
async function isAlreadyReg(req,res,next){

    let token;

    //  check Authorization header
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    //  check cookies
    if (!token && req.cookies.token) {
      token = req.cookies.token;
    }

    //  no token
    if (!token) {
      return res.status(401).json({ msg: "Login required" });
    }

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