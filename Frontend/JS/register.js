const form = document.getElementById("registerForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const passwordStrengthText = document.getElementById("password-strength");
const errorMessage = document.getElementById("error-message");

function togglePassword() {
  const password = passwordInput;
  const toggle = document.querySelector(".toggle-password");
  if (password.type === "password") {
    password.type = "text";
    toggle.textContent = "Hide";
  } else {
    password.type = "password";
    toggle.textContent = "Show";
  }
}

function ctogglePassword() {
  const cpassword = confirmPasswordInput;
  const toggle = document.querySelector(".c-toggle-password");
  if (cpassword.type === "password") {
    cpassword.type = "text";
    toggle.textContent = "Hide";
  } else {
    cpassword.type = "password";
    toggle.textContent = "Show";
  }
}


//when register form submit
document.addEventListener("DOMContentLoaded", () => {

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    errorMessage.textContent = "";

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      errorMessage.textContent = "Passwords do not match ❌";
      return;
    }

  const data = {
    username: document.getElementById("name").value.toLowerCase(),
    dob: document.getElementById("dob").value,
    mobileNumber: document.getElementById("mobileNumber").value,
    email: document.getElementById("email").value.toLowerCase(),
    aadharNumber: document.getElementById("aadharNumber").value,
    gender: document.getElementById("gender").value.toLowerCase(),
    bloodGroup: document.getElementById("bloodGroup").value,
    address: document.getElementById("address").value.toLowerCase(),
    pinCode: document.getElementById("pinCode").value,
    password: password,
  };

  try {
    const res = await fetch("https://hackathon-project-9jun.onrender.com/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok && result.success === true) {
      errorMessage.className = "text-success";
      errorMessage.textContent = result.msg || "Registered successfully ✅";

      setTimeout(() => {
        window.location.href = "../HTML/loogin.html";
      }, 2000);
    } else {
      errorMessage.className = "text-danger";

      if(result.msg){
        errorMessage.textContent = result.msg || "Registration failed ❌";
      }
      else if(result.errors && errors.length >=0){
        errorMessage.textContent = result.errors[0].msg || "Registration failed ❌";
      }
      else{
        errorMessage.textContent ="Somthing want worng ❌";
      }
    }
  } catch (err) {
    console.error(err);
    errorMessage.className = "text-danger";
    errorMessage.textContent = "Server error ❌";
  }
});

});
