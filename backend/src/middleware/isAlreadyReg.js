const jwt = require("jsonwebtoken");
const donorModel = require("../models/donor.model");
async function isAlreadyReg(req,res,next){
    const token = req.cookies.token;

    console.log(token);
    
    if(!token){
        return res.status(401).json({
            msg:"Registration/Login is required",
            success:false
        })
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