//  HTML loader
function loadHTML(id, file, callback) {
  fetch(file)
    .then((res) => res.text())
    .then((data) => {
      document.getElementById(id).innerHTML = data;
      if (callback) callback(); // only header ke baad init
    })
    .catch((err) => console.log(err));
}

//  load header + footer
document.addEventListener("DOMContentLoaded", () => {
  loadHTML("header", "nav.html", initNavbar);
  loadHTML("footer", "foot.html");
});

//  NAVBAR INIT
function initNavbar() {
  const navToggleBtn = document.getElementById("navToggleBtn");
  const navToggleLinks = document.getElementById("navToggleLinks");

  if (navToggleBtn && navToggleLinks) {
    navToggleBtn.addEventListener("click", () => {
      const isActive = navToggleLinks.classList.toggle("active");
      navToggleBtn.setAttribute("aria-expanded", isActive);
    });
  }

  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const dashboardLink = document.getElementById("dashboardLink");
  const profileSection = document.getElementById("profileSection");

  const isloginIn = localStorage.getItem("isloginIn");

  //  LOGIN STATE
  if (isloginIn === "true") {
    if (loginBtn) loginBtn.style.display = "none";
    if (registerBtn) registerBtn.style.display = "none";
    if (dashboardLink) dashboardLink.style.display = "block";
    if (profileSection) profileSection.style.display = "block";
  } else {
    if (loginBtn) loginBtn.style.display = "block";
    if (registerBtn) registerBtn.style.display = "block";
    if (dashboardLink) dashboardLink.style.display = "none";
    if (profileSection) profileSection.style.display = "none";
  }

  //  PROFILE DROPDOWN
  const profileBtn = document.getElementById("profileBtn");
  const dropdown = document.getElementById("profileDropdown");

  if (profileBtn && dropdown) {
    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("active");
    });

    document.addEventListener("click", () => {
      dropdown.classList.remove("active");
    });
  }

  //  IMAGE UPLOAD
  const fileInput = document.getElementById("uploadImg");
  const changeImgBtn = document.getElementById("changeImgBtn");
  const profileLarge = document.getElementById("profileLarge");

  if (changeImgBtn && fileInput) {
    changeImgBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      fileInput.click();
    });

    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = function () {
          if (profileBtn) profileBtn.src = reader.result;
          if (profileLarge) profileLarge.src = reader.result;

          localStorage.setItem("profileImg", reader.result);
        };

        reader.readAsDataURL(file);
      }
    });
  }

  //  LOAD IMAGE
  const savedImg = localStorage.getItem("profileImg");
  if (savedImg) {
    if (profileBtn) profileBtn.src = savedImg;
    if (profileLarge) profileLarge.src = savedImg;
  }

  // 👤 USER INFO
  const userName = document.getElementById("userName");
  const userEmail = document.getElementById("userEmail");

  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");

  if (userName) userName.innerText = name || ".....";
  if (userEmail) userEmail.innerText = email || ".....";
}

//  LOGOUT
async function logout() {
  try {
    await fetch(BASE_URL + "/api/auth/logout", {
      method: "GET",
      credentials: "include",
    });
  } catch (err) {
    console.log(err.message);
  }

  localStorage.clear();
  window.location.reload();
}