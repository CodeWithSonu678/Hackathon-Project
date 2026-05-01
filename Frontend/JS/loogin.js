const BASE_URL = "https://rakht-seva.onrender.com";
const form = document.getElementById("loginForm");
const errorMessage = document.getElementById("error-message");
const passwordInput = document.getElementById("password");

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



//WHEN LOGIN FORM SUBMIT
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorMessage.textContent = "";

  const data = {
    mobileNumber: document.getElementById("mobileNumber").value,
    password: document.getElementById("password").value,
  };

  try {
    const res = await fetch(BASE_URL+"/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok && result.success === true) {
      localStorage.setItem("isloginIn", "true");
      localStorage.setItem("name", result.user.username);
      localStorage.setItem("currentId", result.user._id);
      localStorage.setItem("email", result.user.email);
      localStorage.setItem("token", result.token);
      errorMessage.className = "text-success";
      errorMessage.textContent = result.msg || "Login successfully ✅";

      setTimeout(() => {
        window.location.href = "../HTML/index.html";
      }, 2000);
    } else {
      errorMessage.className = "text-danger";

      if(result.errors && result.errors.length >0){
        errorMessage.textContent = result.errors[0].msg || "Login failed ❌";
      }
      else if(result.msg){
        errorMessage.textContent = result.msg;
      }
      else{
        errorMessage.textContent ="Somthing want worng ❌";
      }
    }
  } catch (err) {
    console.error(err);
    errorMessage.textContent = "Server error ❌";
    errorMessage.className = "text-danger";
  }
});
