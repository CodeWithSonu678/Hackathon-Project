const navToggleBtn = document.getElementById("navToggleBtn");
const navToggleLinks = document.getElementById("navToggleLinks");
const donorForm = document.getElementById("donorForm");
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


// Handle donation history radio buttons
const yesRadio = document.getElementById("q4_yes");
const noRadio = document.getElementById("q4_no");
const lastDonationRow = document.querySelector(".p-2.d-none");

function toggleLastDonationField() {
  if (yesRadio.checked) {
    lastDonationRow.classList.remove("d-none");
  } else {
    lastDonationRow.classList.add("d-none");
  }
}

yesRadio.addEventListener("change", toggleLastDonationField);
noRadio.addEventListener("change", toggleLastDonationField);

//when donor click submit btn
donorForm.addEventListener("submit",async (e) => {
  e.preventDefault();
  errorMessage.textContent = "";

  const data = {
    donorName : document.getElementById("donorName").value,
    mobileNumber : document.getElementById("mobileNumber").value,
    age : document.getElementById("age").value,
    bloodGroup : document.getElementById("bloodGroup").value,
    lastDonation : document.querySelector('input[name="medications"]:checked')?.value ==="true",
    lastDonationDate : document.getElementById("lastDonation").value,
    city : document.getElementById("city").value
  };

  try {
    const res = await fetch("https://hackathon-project-9jun.onrender.com/api/auth/donate-form",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data),
        credentials: "include"

    });

    const result = await res.json();
    console.log(result)

    if(res.ok && result.success === true){
        errorMessage.className = "text-success";
        errorMessage.textContent = result.msg || "Now You are donor";

        setInterval(()=>{
            window.location.href = "../index.html"
        },2000);
    }else{
        errorMessage.className = "text-danger";


        
         errorMessage.className = "text-danger";

      if(result.errors && errors.length >=0){
        errorMessage.textContent = result.errors[0].msg || "Somtheing went wrong ❌";
      }
      else if(result.msg){
        errorMessage.textContent = result.msg || "Server Error try again";
      }
      else{
        errorMessage.textContent ="Somthing want worng ❌";
      }
    }
  } catch (err) {
    console.log(err.message)
  }
});


