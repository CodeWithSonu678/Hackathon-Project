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
    const res = await fetch("http://127.0.0.1:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include" 
    });

    const result = await res.json();

    if (res.ok && result.success === true) {
      localStorage.setItem("isloginIn", "true");
      errorMessage.className = "text-success";
      errorMessage.textContent = result.msg || "Login successfully ✅";

      setTimeout(() => {
        window.location.href = "../index.html";
      }, 2000);
    } else {
      errorMessage.className = "text-danger";

      if(result.errors && errors.length >=0){
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
    console.error(err.message);
    errorMessage.textContent = "Server error ❌";
    errorMessage.className = "text-danger";
  }
});
