const nodemailer = require("nodemailer");

//koun bhej rha hai
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_USER,
    pass: process.env.AUTH_PASS,
  },
});

//mail ka format
const mailFormat = (donorName) => `
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
      html: mailFormat(donorName),
    });

    return info;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendMailDonor };
