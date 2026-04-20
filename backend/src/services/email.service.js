const nodemailer = require("nodemailer");
const {generateOtp} = require('../utils/generateOtp');

//koun bhej rha hai
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_USER,
    pass: process.env.AUTH_PASS,
  },
});

//mail ka format
const donorFormat = (donorName) => `
         <div style="font-family: 'Segoe UI', Arial; background:#f4f6f8; padding:30px;">
  
  <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 8px 20px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg, #ff4d4d, #cc0000); color:white; padding:25px; text-align:center;">
      <h1 style="margin:0;">🩸 Rakht Setu</h1>
      <p style="margin:5px 0 0;">You are now a Donor ❤️</p>
    </div>

    <!-- Body -->
    <div style="padding:25px;">
      
      <h2 style="color:#333;">Welcome, ${donorName} 👋</h2>

      <p style="color:#555; line-height:1.6;">
        Thank you for registering as a <b>Blood Donor</b>.  
        Your small step can save lives and bring hope to many ❤️
      </p>

      <!-- Motivation Box -->
      <div style="background:#ffe6e6; padding:15px; border-left:5px solid red; border-radius:8px; margin:20px 0;">
        <p style="margin:0; font-style:italic; color:#800000;">
          "The blood you donate gives someone another chance at life."
        </p>
      </div>

      <!-- Guidelines -->
      <h3 style="color:#333;">📌 Donor Guidelines</h3>
      <ul style="color:#555; line-height:1.8; padding-left:20px;">
        <li>💧 Stay hydrated before donating</li>
        <li>🍎 Eat healthy food</li>
        <li>🚫 Avoid alcohol before donation</li>
        <li>🗓️ Maintain proper gap between donations</li>
      </ul>

      <!-- CTA -->
      <div style="text-align:center; margin:30px 0;">
        <a href="#" style="background:red; color:white; padding:12px 20px; text-decoration:none; border-radius:6px; font-weight:bold;">
          ❤️ Continue Saving Lives
        </a>
      </div>

      <p style="color:#777;">
        Thank you for being a hero 🦸‍♂️
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#777;">
      © 2026 Rakht Setu | Saving Lives Together ❤️
    </div>

  </div>

</div>
    `;

//kise bhja jaa rha h aur kya
const sendMailDonor = async (email, donorName) => {
  try {
    const info = await transporter.sendMail({
      from: `"Rakht Setu ❤️" <${process.env.AUTH_USER}>`,
      to: email,
      subject: "🩸 Welcome! You are now a Blood Donor",
      html: donorFormat(donorName),
    });

    return info;
  } catch (error) {
    console.log(error);
  }
};

//request mail send to donor

const requestMailFormat = (
  patientName,
  bloodGroup,
  district,
  phone,
  timePeriod,
) => `
  <div style="font-family: 'Segoe UI', Arial; background:#f4f6f8; padding:30px;">
  <div style="max-width:600px; margin:auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 8px 20px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg, #ff4d4d, #cc0000); color:white; padding:25px; text-align:center;">
      <h2 style="margin:0;">🩸 Blood Request Alert</h2>
    </div>

    <!-- Body -->
    <div style="padding:25px;">
      <h3 style="color:#333;">Hello Donor 👋</h3>

      <p style="color:#555;">
        A patient urgently needs your help. Please check the details below:
      </p>

      <!-- Card -->
      <div style="background:#fff5f5; border:1px solid #ffd6d6; padding:15px; border-radius:8px; margin:15px 0;">
        <p><b>👤 Patient Name:</b> ${patientName}</p>
        <p><b>🩸 Blood Group:</b> ${bloodGroup}</p>
        <p><b>📍 Location:</b> ${district}</p>
        <p><b>📞 Contact:</b> ${phone}</p>
        <p><b>⏳ Required Within:</b> ${timePeriod}</p>
      </div>

      <!-- CTA -->
      <div style="text-align:center; margin:25px 0;">
        <a href="#" style="background:red; color:white; padding:12px 20px; text-decoration:none; border-radius:6px;">
          ❤️ Accept Request
        </a>
      </div>

      <p style="color:#777;">
        Your one decision can save a life 🙏
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#777;">
      Rakht Sevu ❤️ | Connecting Lives
    </div>

  </div>
</div>
`;
const sendRequestMailDonor = async (
  pateintEmail,
  donorEmail,
  patientName,
  bloodGroup,
  district,
  phone,
  timePeriod,
) => {
  try {
    const info = await transporter.sendMail({
      from: `"Rakht Setu ❤️" <${process.env.AUTH_USER}>`,
      to: donorEmail,
      replyTo: pateintEmail,
      subject: "🩸 Welcome! You have a request for blood",
      html: requestMailFormat(
        patientName,
        bloodGroup,
        district,
        phone,
        timePeriod,
      ),
    });

    return info;
  } catch (error) {
    console.log(error);
  }
};

const forgotOtpFormat = (otp) => `
  <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
    
    <div style="max-width:500px; margin:auto; background:white; padding:20px; border-radius:10px; text-align:center;">
      
      <h2 style="color:#4CAF50;">🔐 OTP Verification</h2>
      
      <p style="font-size:16px; color:#333;">
        Use the OTP below to forgot your password
      </p>

      <div style="
        font-size:30px;
        font-weight:bold;
        letter-spacing:5px;
        margin:20px 0;
        color:#4CAF50;">
        ${otp}
      </div>

      <p style="color:gray;">
        This OTP is valid for 5 minutes.
      </p>

      <hr/>

      <p style="font-size:12px; color:gray;">
        This is an automated email. Please do not reply.
      </p>

      <p style="font-size:12px; color:gray;">
        © 2026 Rakht Sevu ❤️
      </p>

    </div>
  </div>
`;
const sendForgotOtp = async (to,subject,otp) => {

  try {
    
    const info = await transporter.sendMail({
      from: process.env.AUTH_USER,
      to,
      subject,
      html: forgotOtpFormat(otp),
    });

    return info;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { sendMailDonor, sendRequestMailDonor,sendForgotOtp };
