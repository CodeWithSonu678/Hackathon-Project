const form = document.getElementById("registerForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
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

function checkPasswordStrength(password) {
  if (!password) return "";

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-[\]{};':"\\|,.<>\/?]/.test(password);
  const length = password.length;

  if (length >= 8 && hasUpper && hasLower && hasNumber && hasSymbol) {
    return "Strong";
  }
  if (length >= 6 && hasUpper && hasNumber) {
    return "Medium";
  }
  return "Weak";
}

passwordInput.addEventListener("input", () => {
  const strength = checkPasswordStrength(passwordInput.value);
  passwordStrengthText.textContent = strength
    ? `Password Strength: ${strength}`
    : "Enter a password to see strength.";
  passwordStrengthText.className =
    "form-text mb-3 " +
    (strength === "Strong"
      ? "text-success"
      : strength === "Medium"
        ? "text-warning"
        : "text-danger");
});

//when register form submit
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorMessage.textContent = "";

  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  //  match check
  if (password !== confirmPassword) {
    errorMessage.textContent = "Passwords do not match ❌";
    errorMessage.className = "text-danger";
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
    const res = await fetch("http://127.0.0.1:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
