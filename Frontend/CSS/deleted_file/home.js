// const navToggleBtn = document.getElementById('navToggleBtn');
// const navToggleLinks = document.querySelector('.nav-links-url');

// if (navToggleBtn && navToggleLinks) {
//   navToggleBtn.addEventListener("click", () => {
//     navToggleLinks.classList.toggle('active');
//   });
// }

// const registerBtn = document.getElementById("registerBtn");
// const logoutBtn = document.getElementById("logoutBtn");
// const loginBtn = document.getElementById("loginBtn");
// const dashboardLink = document.getElementById("dashboardLink");

// // check login state
// const isloginIn = localStorage.getItem("isloginIn");
// const profileSection = document.getElementById("profileSection");

// //  LOGIN CHECK
// if (isloginIn === "true") {
//   // hide login/register
//   loginBtn.style.display = "none";
//   registerBtn.style.display = "none";
//   dashboardLink.style.display = "block";

//   // show profile
//   profileSection.style.display = "block";
// } else {
//   // show login/register
//   loginBtn.style.display = "block";
//   registerBtn.style.display = "block";
//   dashboardLink.style.display = "none";

//   // hide profile
//   profileSection.style.display = "none";
// }

// const profileBtn = document.getElementById("profileBtn");
// const dropdown = document.getElementById("profileDropdown");
// const fileInput = document.getElementById("uploadImg");
// const changeImgBtn = document.getElementById("changeImgBtn");
// const profileLarge = document.getElementById("profileLarge");

// //  ONLY dropdown open
// profileBtn.addEventListener("click", (e) => {
//   e.stopPropagation();
//   dropdown.classList.toggle("active");
// });

// //  outside click close
// document.addEventListener("click", () => {
//   dropdown.classList.remove("active");
// });

// //  ONLY button triggers upload
// changeImgBtn.addEventListener("click", (e) => {
//   e.stopPropagation();
//   fileInput.click();
// });

// //  upload logic
// fileInput.addEventListener("change", (e) => {
//   const file = e.target.files[0];

//   if (file) {
//     const reader = new FileReader();

//     reader.onload = function () {
//       profileBtn.src = reader.result;
//       profileLarge.src = reader.result;

//       localStorage.setItem("profileImg", reader.result);
//     };

//     reader.readAsDataURL(file);
//   }
// });

// //  load image
// window.addEventListener("load", () => {
//   const savedImg = localStorage.getItem("profileImg");

//   if (savedImg) {
//     profileBtn.src = savedImg;
//     profileLarge.src = savedImg;
//   }
// });

// const userName = document.getElementById("userName");
// const userEmail = document.getElementById("userEmail");

// //  load name and email
// window.addEventListener("load", () => {
//   const name = localStorage.getItem("name");
//   const email = localStorage.getItem("email");
//   if (name) {
//     userName.innerText = name;
//   } else {
//     userName.innerText = ".....";
//   }

//   if (email) {
//     userEmail.innerText = email;
//   } else {
//     userEmail.innerText = ".....";
//   }
// });

// //  logout
// async function logout() {
//   localStorage.removeItem("isloginIn");
//   localStorage.removeItem("name");
//   localStorage.removeItem("profileImg");

//   localStorage.removeItem("email");
//   window.location.reload();
//   const res = await fetch(BASE_URL + "/api/auth/logout", {
//     method: "GET",
//     credentials: "include",
//   });
// }