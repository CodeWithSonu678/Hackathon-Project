const crypto = require('crypto');

function generateOtp(){
    const length = 6;
    let otp ="";
    for(let i =0;i<length;i++){
        otp += crypto.randomInt(0,10);
    }

    return otp
}

module.exports = {generateOtp}