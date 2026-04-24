const nodemailer = require("nodemailer");
const { generateOtp } = require("../utils/generateOtp");

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
const sendForgotOtp = async (to, subject, otp) => {
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

//template for patient code to donor email
const donorDonationCode = (ddonationCode) => `
  <!DOCTYPE html>

<html>
<head>
  <meta charset="UTF-8">
</head>

<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
    <tr>
      <td align="center">


    <table width="500" style="background:#ffffff;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);overflow:hidden;">

      <tr>
        <td style="background:linear-gradient(135deg,#d50000,#ff5252);padding:20px;text-align:center;color:white;">
          <h2 style="margin:0;">🩸 Blood Donation</h2>
          <p style="margin:5px 0 0;">Verification Code</p>
        </td>
      </tr>

      <tr>
        <td style="padding:25px;color:#333;">

          <p>Hello <b>Donor</b>,</p>

          <p>
            Thank you for your willingness to donate blood ❤️<br>
            Your donation process is almost complete.
          </p>

          <p>Use the verification code below:</p>

          <div style="text-align:center;margin:20px 0;">
            <span style="background:#f1f3f5;padding:15px 25px;font-size:22px;font-weight:bold;border-radius:8px;color:#d50000;">
              ${ddonationCode}
            </span>
          </div>

          <div style="background:#fff5f5;padding:15px;border-radius:8px;font-size:13px;">
            <b>📌 Instructions:</b>
            <ul>
              <li>This code belongs to the patient.</li>
              <li>Ask the patient for their code and enter it in the app.</li>
              <li>Do NOT share your own code publicly.</li>
            </ul>
          </div>

          <p style="color:#777;font-size:13px;">⏳ This code is valid for limited time.</p>

          <p>🙏 You are saving a life.</p>

        </td>
      </tr>

      <tr>
        <td style="background:#f8f9fa;padding:15px;text-align:center;font-size:12px;color:#888;">
          Rakth Seva Team 🩸
        </td>
      </tr>

    </table>

  </td>
</tr>

  </table>

</body>
</html>

`;

//template for donor code to patient email
const patientDonationCode = (pdonationCode) => `
  <!DOCTYPE html>

<html>
<head>
  <meta charset="UTF-8">
</head>

<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
    <tr>
      <td align="center">


    <table width="500" style="background:#ffffff;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);overflow:hidden;">

      <tr>
        <td style="background:linear-gradient(135deg,#1976d2,#42a5f5);padding:20px;text-align:center;color:white;">
          <h2 style="margin:0;">🩸 Blood Donation</h2>
          <p style="margin:5px 0 0;">Verification Code</p>
        </td>
      </tr>

      <tr>
        <td style="padding:25px;color:#333;">

          <p>Hello,</p>

          <p>
            Good news! A donor is ready to help you ❤️
          </p>

          <p>Use the verification code below:</p>

          <div style="text-align:center;margin:20px 0;">
            <span style="background:#f1f3f5;padding:15px 25px;font-size:22px;font-weight:bold;border-radius:8px;color:#1976d2;">
              ${pdonationCode}
            </span>
          </div>

          <div style="background:#eef6ff;padding:15px;border-radius:8px;font-size:13px;">
            <b>📌 Instructions:</b>
            <ul>
              <li>This code belongs to the donor.</li>
              <li>Share this code with the donor.</li>
              <li>The donor will use it to confirm donation.</li>
            </ul>
          </div>

          <p style="color:#777;font-size:13px;">⏳ This code is valid for limited time.</p>

          <p>💙 Wishing you good health.</p>

        </td>
      </tr>

      <tr>
        <td style="background:#f8f9fa;padding:15px;text-align:center;font-size:12px;color:#888;">
          Rakth Seva Team 🩸
        </td>
      </tr>

    </table>

  </td>
</tr>

  </table>

</body>
</html>

`;

const sendToDonorDCode = async (to, subject, dCode) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.AUTH_USER,
      to,
      subject,
      html: donorDonationCode(dCode),
    });

    return info;
  } catch (error) {
    console.log(error.message);
  }
};

const sendToPatientDCode = async (to, subject, dCode) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.AUTH_USER,
      to,
      subject,
      html: patientDonationCode(dCode),
    });

    return info;
  } catch (error) {
    console.log(error.message);
  }
};


module.exports = { sendMailDonor, sendRequestMailDonor, sendForgotOtp,sendToDonorDCode,sendToPatientDCode };
