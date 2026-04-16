const BASE_URL = "http://127.0.0.1:3000";
const navToggleBtn = document.getElementById("navToggleBtn");
const navToggleLinks = document.getElementById("navToggleLinks");
const eligibleForm = document.getElementById("eligibleForm");
const errorMessage = document.getElementById("error-message");

if (navToggleBtn && navToggleLinks) {
  navToggleBtn.addEventListener("click", () => {
    const isOpen = navToggleLinks.classList.toggle("active");
    navToggleBtn.setAttribute("aria-expanded", String(isOpen));
    navToggleLinks.setAttribute("aria-hidden", String(!isOpen));
  });
}

const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginBtn = document.getElementById("loginBtn");

// check login state
const isloginIn = localStorage.getItem("isloginIn");
const profileSection = document.getElementById("profileSection");

// 🔥 LOGIN CHECK
if (isloginIn === "true") {
  // hide login/register
  loginBtn.style.display = "none";
  registerBtn.style.display = "none";

  // show profile
  profileSection.style.display = "block";
} else {
  // show login/register
  loginBtn.style.display = "block";
  registerBtn.style.display = "block";

  // hide profile
  profileSection.style.display = "none";
}

const profileBtn = document.getElementById("profileBtn");
const dropdown = document.getElementById("profileDropdown");
const fileInput = document.getElementById("uploadImg");
const changeImgBtn = document.getElementById("changeImgBtn");
const profileLarge = document.getElementById("profileLarge");

//  ONLY dropdown open
profileBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdown.classList.toggle("active");
});

//  outside click close
document.addEventListener("click", () => {
  dropdown.classList.remove("active");
});

//  ONLY button triggers upload
changeImgBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  fileInput.click();
});

//  upload logic
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function () {
      profileBtn.src = reader.result;
      profileLarge.src = reader.result;

      localStorage.setItem("profileImg", reader.result);
    };

    reader.readAsDataURL(file);
  }
});

//  load image
window.addEventListener("load", () => {
  const savedImg = localStorage.getItem("profileImg");

  if (savedImg) {
    profileBtn.src = savedImg;
    profileLarge.src = savedImg;
  }
});

//  logout
function logout() {
  localStorage.removeItem("isloginIn");
  window.location.reload();
}

if (eligibleForm) {
  eligibleForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMessage.textContent = "";

    let lastDonation = document.getElementById("last_donation").value;
    let checkLastDonation = document.querySelector(
      'input[name="haveDonated"]:checked',
    )?.value;

    if (checkLastDonation === "true" && !lastDonation) {
      errorMessage.textContent = "Please select last donation date ❌";
      return;
    }
    const data = {
      age:
        document.querySelector('input[name="age"]:checked')?.value === "true",
      weight:
        document.querySelector('input[name="weight"]:checked')?.value ===
        "true",
      healthCondition:
        document.querySelector('input[name="healthCondition"]:checked')
          ?.value === "true",
      takeMedicine:
        document.querySelector('input[name="takeMedicine"]:checked')?.value ===
        "true",
      lastDonation,
    };

    // 🔥 validation
    if (
      document.querySelector('input[name="age"]:checked') === null ||
      document.querySelector('input[name="weight"]:checked') === null ||
      document.querySelector('input[name="healthCondition"]:checked') ===
        null ||
      document.querySelector('input[name="takeMedicine"]:checked') === null ||
      document.querySelector('input[name="haveDonated"]:checked') === null
    ) {
      errorMessage.textContent = "Please answer all questions ❌";
      return;
    }

    try {
      const res = await fetch(BASE_URL + "/api/auth/eligibility", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok && result.eligible === true) {
        errorMessage.className = "text-success";
        errorMessage.textContent = result.msg || "You are eligible ✅";

        setTimeout(() => {
          window.location.href = "../HTML/donate.html";
        }, 2000);
      } else {
        errorMessage.className = "text-danger";

        if (result.msg) {
          errorMessage.textContent = result.msg || "Not eligible ❌";
        } else if (result.errors && result.errors.length >= 0) {
          errorMessage.textContent = result.errors[0].msg || "Not eligible ❌";
        } else {
          errorMessage.textContent = "Not eligible ❌";
        }
      }
    } catch (err) {
      console.error(err);
      errorMessage.className = "text-danger";
      errorMessage.textContent = "Server error ❌";
    }
  });
}

const questionBlood = document.getElementById("donate-date");
const hideDate = document.getElementById("q5_no");
const showDate = document.getElementById("q5_yes");

if (questionBlood && hideDate) {
  hideDate.addEventListener("click", () => {
    questionBlood.style.display = "none";
  });
}

if (questionBlood && showDate) {
  showDate.addEventListener("click", () => {
    questionBlood.style.display = "flex";
  });
}
