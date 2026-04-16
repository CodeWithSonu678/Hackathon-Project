const BASE_URL = "http://127.0.0.1:3000";
// logout function
async function logout() {
  try {
    const res = await fetch(BASE_URL+"/api/auth/logout", {
      method: "GET",
      credentials: "include"
    });

    const result = await res.json();
    console.log(result)

    localStorage.removeItem("isloginIn");
    window.location.href = "./index.html";

  } catch (error) {
    console.log(error.message);
  }
}

// check login state
function checkAuth() {
  const isloginIn = localStorage.getItem("isloginIn");

  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const profile = document.getElementById("profileSection");

  if (isloginIn) {
    loginBtn.style.display = "none";
    registerBtn.style.display = "none";
    profile.style.display = "block";
  } else {
    profile.style.display = "none";
  }
}

// auto run
window.addEventListener("load", checkAuth);