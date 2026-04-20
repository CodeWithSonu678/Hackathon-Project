const BASE_URL = "http://127.0.0.1:3000";
const navToggleBtn = document.getElementById("navToggleBtn");
const navToggleLinks = document.querySelector(".nav-links-url");
const errorMessage = document.getElementById("error-message");

if (navToggleBtn && navToggleLinks) {
  navToggleBtn.addEventListener("click", () => {
    navToggleLinks.classList.toggle("active");
  });
}

const editButton = document.getElementById("edit-btn");
const editBody = document.querySelector(".edit-form");
const cancelButton = document.getElementById("cancel-btn");

if (editBody && editButton) {
  editButton.addEventListener("click", () => {
    editBody.style.display = "flex";
  });
}

if (cancelButton && editBody) {
  cancelButton.addEventListener("click", () => {
    editBody.style.display = "none";
  });
}

const infoSection = document.getElementById("info-section");

//  load image
let url = "";
window.addEventListener("load", () => {
  const savedImg = localStorage.getItem("profileImg");

  if (savedImg) {
    url = savedImg;
  }
});

let currentDashData = {};
//dashboard info load
const loadInfoUser = async () => {
  try {
    const res = await fetch(BASE_URL + "/api/auth/get-user-info", {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    const userData = data.userData;
    currentDashData = userData;

    const htmlTemplate = `
        <div class="user-img">
                        <img src=${url} class="decImg" placeholder="User Img"/>
                </div>
                <div class="user-info">
                        <div class="main-info">
                                <div class="info">
                                        <label for="">Name:</label>
                                        <p>${userData.username.toUpperCase()}</p>
                                </div>
                                <div class="info">
                                        <label for="">Age:</label>
                                        <p>${userData.age}</p>
                                </div>
                                <div class="info">
                                        <label for="">Email:</label>
                                        <p>${userData.email}</p>
                                </div>
                                <div class="info">
                                        <label for="">Phone No:</label>
                                        <p>+91 ${userData.mobileNumber}</p>
                                </div>
                        </div>

                        <div class="other-info">
                                <div class="info">
                                        <label for="">DOB:</label>
                                        <p>${userData.dob}</p>
                                </div>
                                <div class="info">
                                        <label for="">Gender:</label>
                                        <p>${userData.gender}</p>
                                </div>
                                <div class="info">
                                        <label for="">Blood Group:</label>
                                        <p>${userData.bloodGroup}</p>
                                </div>
                                <div class="info">
                                        <label for="">Address:</label>
                                        <p>${userData.address}</p>
                                </div>
                        </div>
                </div>
                `;

    infoSection.innerHTML = htmlTemplate;
  } catch (error) {
    console.log(error);
  }
};

loadInfoUser();

//Dashboard Info Edit/Update

function editFormFill() {
  document.getElementById("nameInput").value = currentDashData.username;
  document.getElementById("ageInput").value = currentDashData.age;
  document.getElementById("emailInput").value = currentDashData.email;
  document.getElementById("phoneInput").value = currentDashData.mobileNumber;
  document.getElementById("dobInput").value = currentDashData.dob;
  document.getElementById("genderInput").value = currentDashData.gender;
  document.getElementById("bloodInput").value = currentDashData.bloodGroup;
  document.getElementById("addressInput").value = currentDashData.address;
}

document.getElementById("editBtn").addEventListener("click", () => {
  editFormFill();
});

const saveChange = document.getElementById("saveChange");

saveChange.addEventListener("click", async () => {
  const data = {
    username: document.getElementById("nameInput").value,
    age: document.getElementById("ageInput").value,
    email: document.getElementById("emailInput").value,
    mobileNumber: document.getElementById("phoneInput").value,
    dob: document.getElementById("dobInput").value,
    gender: document.getElementById("genderInput").value,
    bloodGroup: document.getElementById("bloodInput").value,
    address: document.getElementById("addressInput").value,
  };

  try {
    const res = await fetch(BASE_URL + "/api/auth/edit-user-info", {
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
      errorMessage.textContent = result.msg || "Profile update is succesfull";

      loadInfoUser();

      setTimeout(() => {
        errorMessage.textContent = "";
        editBody.style.display = "none";
        editFormFill();
      }, 1000);
    } else {
      errorMessage.className = "text-danger";

      if (result.errors && result.errors.length >= 0) {
        errorMessage.textContent =
          result.errors[0].msg || "Somtheing went wrong ❌";
      } else if (result.msg) {
        errorMessage.textContent = result.msg || "Server Error try again";
      } else {
        errorMessage.textContent = "Somthing want worng ❌";
      }
    }
  } catch (error) {
    console.log(error);
  }
});
//All request load
async function loadOutcomingRequest() {
  const container = document.getElementById("request-container");

  try {
    const res = await fetch(BASE_URL + "/api/auth/all-request-outgoing", {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    console.log(data);
    if (!data) {
      container.innerHTML = "<p>No request found.</p>";
      return;
    }

    data.allRequest.forEach((req) => {
      const card = document.createElement("div");
      card.className = "request-cards";

      card.innerHTML = `
                        
                        <div class="request-inner" style="margin-left: 18px;">
                                <div class="request-name">
                                        <span><b>Name: </b>${req.donor.donorName}</span>
                                        <span><b>Age: </b>${req.donor.age}</span>
                                        <span><b>Blood Group: </b>${req.donor.bloodGroup}</span>
                                </div>
                                <div class="request-info">
                                        <p><b><i class="bi bi-geo-alt"></i></b> ${req.hospitals.join(", ")}.</p>
                                        <p><b><i class="bi bi-clock"></i></b>${new Date(req.createdAt).toLocaleDateString()}</p>
                                </div>
                        </div>


                        <div class="request-btn">
                                <button>Pending..</button>
                                <button onclick="showTracker('${req._id}')" style="display:none";>Tracker</button>
                        </div>
                
                `;

      container.appendChild(card);
    });
  } catch (error) {
    console.log(error);
  }
}

async function loadIncomingRequest() {
  const container = document.getElementById("incomingRequest");

  try {
    const res = await fetch(BASE_URL + "/api/auth/all-request-incoming", {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    console.log(data)
    if (!data) {
      container.innerHTML = "<p>No request found.</p>";
      return;
    }

    data.allRequest.forEach((req) => {
      const card = document.createElement("div");
      card.className = "incoming-request-cards";

      card.innerHTML = `
      <div class="d-card-body m-3" >
                         <div class="d-request-head">
                                        <span><b>${req.patientName}</b></span>
                                        <span id="c-badge">${req.timePeriod}</span>
                                </div>
                                <div class="d-request-inner" style="margin-left: 18px;">
                                        <p><i class="bi bi-exclamation-circle"></i> Blood Group : ${req.bloodGroup}</p>
                                        <p><i class="bi bi-geo-alt"></i> ${req.user.address} </p>
                                        <p><i class="bi bi-clock"></i> ${new Date(req.createdAt).toLocaleString("en-IN")}</p>

                                </div>

                                <div class="d-request-btn">
                                        <button onclick="showTracker('${req._id}')"
                                                style="background-color: rgb(0, 100, 0); color: white;">Accept</button>
                                        <button onclick="showTracker('${req._id}')" style="background-color: #880015;
                                        color: white;">Reject</button>
                                </div>
                 </div>
                `;

      container.appendChild(card);
    });
  } catch (error) {
    console.log(error);
  }
}

loadOutcomingRequest();
loadIncomingRequest();

async function showTracker() {
  const trackerSection = document.getElementById("tracker-section");
  trackerSection.style.display = "block";
}

const trackerBtn = document.querySelector('#tracker-btn');
const cancelTracker = document.querySelector('#tracker-cancel');
const trackerSection = document.querySelector('#tracker-section');

if (trackerBtn && cancelTracker && trackerSection){
  trackerBtn.addEventListener('click', () => {
    trackerSection.style.display = 'block';
    trackerSection.classList.add('show');
  });

  cancelTracker.addEventListener('click', () => {
    trackerSection.style.display = 'none';
    trackerSection.classList.add('show');
  });
}
