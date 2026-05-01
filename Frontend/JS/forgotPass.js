const BASE_URL = "https://rakht-seva.onrender.com";

const errorMessage = document.getElementById("error-message");
const mailBox = document.getElementById("mail");
const otpBox = document.getElementById("otpBox");
const passwordBox = document.getElementById("passwordBox");

const sendMail = document.getElementById("sendMail");

//send otp to mail
async function sendOtp() {
  const emailInput = document.getElementById("emailInput").value;

  if (!emailInput) {
    alert("PLZZZZZ enter email to send otp ");
    return;
  }
  try {
    const res = await fetch(BASE_URL + "/api/auth/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: emailInput }),
    });

    const result = await res.json();
    if (res.ok && result.success === true) {
      errorMessage.className = "text-success";
      
      errorMessage.textContent = result.msg || "OTP sent successfully";

      localStorage.setItem("OtpEmail", emailInput);
      setTimeout(() => {
        errorMessage.textContent = "";
        mailBox.style.display = "none";
        otpBox.style.display = "block";
      }, 2000);
    } else {
      errorMessage.className = "text-danger";

      if (result.msg) {
        errorMessage.textContent = result.msg || "Server Error try again";

        setTimeout(() => {
          errorMessage.textContent = "";
          mailBox.style.display = "none";
          otpBox.style.display = "block";
        }, 2000);
      } else {
        errorMessage.textContent = "Somthing want worng ❌";
      }
    }
  } catch (error) {
    console.log(error);
  }
}

sendMail.addEventListener("click", async () => {
  sendOtp();
});

//otp box mein cursor smoothly move karna
const inputs = document.querySelectorAll(".otp-box input");

inputs.forEach((input, index) => {
  //  input fill → next box
  input.addEventListener("input", (e) => {
    const value = e.target.value;

    // sirf number allow
    if (!/^\d$/.test(value)) {
      e.target.value = "";
      return;
    }

    // next input focus
    if (index < inputs.length - 1) {
      inputs[index + 1].focus();
    }
  });

  //  backspace → previous box
  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !input.value && index > 0) {
      inputs[index - 1].focus();
    }
  });
});

function getOtp() {
  let otp = "";
  inputs.forEach((input) => {
    otp += input.value;
  });

  return otp;
}

//verify otp section code here
const verifyOtpBtn = document.getElementById("verifyOtp");
const otpErrorMessage = document.getElementById("otp-error-message");
async function veriyfOtp() {
  let data = {
    email: localStorage.getItem("OtpEmail"),
    userOtp: getOtp(),
  };
  try {
    const res = await fetch(BASE_URL + "/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok && result.success === true) {
      otpErrorMessage.className = "text-success";
      otpErrorMessage.textContent = result.msg || "OTP verified successfully";

      setTimeout(() => {
        otpErrorMessage.textContent = "";
        otpBox.style.display = "none";
        passwordBox.style.display = "block";
      }, 2000);
    } else {
      otpErrorMessage.className = "text-danger";

      if (result.msg) {
        otpErrorMessage.textContent = result.msg || "Server Error try again";
      } else {
        otpErrorMessage.textContent = "Somthing want worng ❌";
      }
    }
  } catch (error) {
    console.log(error);
  }
}

verifyOtpBtn.addEventListener("click", () => {
  veriyfOtp();
});

//resend otp code here
const resendOtp = document.getElementById("resendOtp");
resendOtp.addEventListener("click", async () => {
  const emailInput = localStorage.getItem("OtpEmail");

  if (!emailInput) {
    alert("PLZZZZZ enter email to send otp ");
    return;
  }
  try {
    const res = await fetch(BASE_URL + "/api/auth/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: emailInput }),
    });

    const result = await res.json();
    if (res.ok && result.success === true) {
      otpErrorMessage.className = "text-success";
      otpErrorMessage.textContent = result.msg || "OTP sent successfully";
      setTimeout(() => {
        otpErrorMessage.textContent = "";
      }, 2000);
    } else {
      otpErrorMessage.className = "text-danger";

      if (result.msg) {
        otpErrorMessage.textContent = result.msg || "Server Error try again";

        setTimeout(() => {
          otpErrorMessage.textContent = "";
        }, 2000);
      } else {
        errorMessage.textContent = "Somthing want worng ❌";
      }
    }
  } catch (error) {
    console.log(error);
  }
});

//save password code here
const savePassBtn = document.getElementById("savePass");
const passErrorMessage = document.getElementById("pass-error-message");

async function saveNewPass() {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password != confirmPassword) {
    passErrorMessage.className = "text-danger";
    passErrorMessage.textContent = "Password & Confirm Password don't match !";
    return;
  }
  let data = {
    email: localStorage.getItem("OtpEmail"),
    newPassword: password,
  };
  
  try {
    const res = await fetch(BASE_URL + "/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok && result.success === true) {
      passErrorMessage.className = "text-success";
      passErrorMessage.textContent =
        result.msg || "Password changed successfully";
      localStorage.removeItem("OtpEmail");

      setTimeout(() => {
        passErrorMessage.textContent = "";
        window.location.href = "loogin.html";
      }, 2000);
    } else {
      passErrorMessage.className = "text-danger";

      if (result.msg) {
        passErrorMessage.textContent = result.msg || "Server Error try again";
      } else {
        passErrorMessage.textContent = "Somthing want worng ❌";
      }
    }
  } catch (error) {
    console.log(error);
  }
}

savePassBtn.addEventListener("click", () => {
  saveNewPass();
});
