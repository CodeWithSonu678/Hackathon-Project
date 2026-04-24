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
                                        <p>${new Date(userData.dob).toLocaleDateString()}</p>
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

    window.allRequests = [...(window.allRequests || []), ...data.allRequest];

    if (!data.allRequest || data.allRequest.length === 0) {
      container.innerHTML = "<p>No request found.</p>";
      return;
    }

    data.allRequest.forEach((req) => {
      if (req.status === "rejected" || req.status === "accepted") {
        addToRecent(req, "outcoming");
        return;
      }

      if (req.status === "pending") {
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
                                <button>Pending....</button>
                        </div>
                
                `;

        container.appendChild(card);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

//time calculation day ago format
function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return Math.floor(seconds / 60) + " min ago";
  if (seconds < 86400) return Math.floor(seconds / 3600) + " hrs ago";

  return Math.floor(seconds / 86400) + " days ago";
}

//fetch all recent data
async function fetchIncomingRecent() {
  try {
    const res = await fetch(BASE_URL + "/api/auth/all-incoming-recent", {
      method: "GET",
      credentials: "include",
    });

    const result = await res.json();

    const data = result.data;

    window.allRequests = [...(window.allRequests || []), ...data];

    data.forEach((req) => {
      addToRecent(req, "incoming");
    });
  } catch (error) {
    console.log(error);
  }
}

//fetch all recent outcoming(me)
async function fetchOutcomingRecent() {
  try {
    const res = await fetch(BASE_URL + "/api/auth/all-outcoming-recent", {
      method: "GET",
      credentials: "include",
    });

    const result = await res.json();

    const data = result.data;

    window.allRequests = [...(window.allRequests || []), ...data];

    data.forEach((req) => {
      addToRecent(req, "outcoming");
    });
  } catch (error) {
    console.log(error);
  }
}

//Recent mein add code here
function addToRecent(req, type) {
  const container = document.getElementById("recentList");

  const isRejected = req.status === "rejected";
  const isCompleted = req.status === "completed";
  const isSuccess = req.status !== "pending" && !isRejected;
  const isIncoming = type === "incoming";

  //  icon + color
  const icon = isIncoming
    ? "bi bi-person-fill-down" //  incoming
    : "bi bi-person-fill-up"; //  outgoing

  const iconColor = isIncoming ? "red" : "green";

  const div = document.createElement("div");
  div.className = "recent-body";

  div.innerHTML = `
    <div class="recent-tab">
      
      <div class="user-detail-tab">
        <i class="${icon}" style="color:${iconColor}; font-size:18px;"></i>

        <div class="tab-detail">
          <p>${req.patientName}</p>
          <span>${req.user.address}</span>
        </div>
      </div>

      <div class="detail-status">
        ${
          isCompleted
            ? `
      <button 
        style="
          background: linear-gradient(135deg, #00c853, #64dd17);
          color:white;
          padding:6px 12px;
          border:none;
          border-radius:20px;
          font-weight:bold;
          box-shadow:0 2px 6px rgba(0,0,0,0.2);
          cursor:default;
        ">
         Completed
      </button>
    `
            : isSuccess
              ? `
        <button 
          class="tracker-btn"
          data-id="${req._id}"
          style="background:green;color:white;padding:6px 12px;border:none;border-radius:6px;">
          Tracker
        </button>
      `
              : `<p style="color:red;">Rejected</p>`
        }

        <span>${timeAgo(req.createdAt)}</span>
      </div>

    </div>
  `;

  //  Accepted → upar
  if (isSuccess) {
    container.prepend(div);
  }
  //  Rejected → niche
  else {
    container.appendChild(div);
  }
}

//Update db on rejected request & update ui fast
async function handleReject(req, btn) {
  const res = await fetch(BASE_URL + "/api/auth/reject/" + req._id, {
    method: "PATCH",
    credentials: "include",
  });

  if (!res.ok) return;

  req.status = "rejected";

  btn.closest(".incoming-request-cards")?.remove();

  addToRecent(req, "incoming");
}

//Update db on accepted request  & update ui fast
async function handleAccept(req, btn) {
  const res = await fetch(BASE_URL + "/api/auth/accept/" + req._id, {
    method: "PATCH",
    credentials: "include",
  });

  if (!res.ok) return;

  req.status = "accepted";

  btn.closest(".incoming-request-cards")?.remove();

  addToRecent(req, "incoming");
}

//all incoming request code here
async function loadIncomingRequest() {
  const container = document.getElementById("incomingRequest");

  try {
    const res = await fetch(BASE_URL + "/api/auth/all-request-incoming", {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    window.allRequests = [...(window.allRequests || []), ...data.allRequest];

    if (!data.allRequest || data.allRequest.length === 0) {
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
                                        <p><i class="bi bi-clock"></i>  ${timeAgo(req.createdAt)}</p>

                                </div>

                                <div class="d-request-btn">
                                        <button onclick='handleAccept(${JSON.stringify(req)}, this)'
                                          style="background-color: green; color: white;">
                                          Accept
                                        </button>

                                        <button onclick='handleReject(${JSON.stringify(req)}, this)'
                                          style="background-color:#880015;color:white;">
                                          Reject
                                        </button>
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
fetchIncomingRecent();
fetchOutcomingRecent();

//Tracker open code here
function openTracker(id) {
  if (!window.allRequests) {
    console.log("No data loaded ❌");
    return;
  }
  const req = window.allRequests.find((r) => String(r._id) === String(id));

  if (!req) {
    console.log("Data not found ❌");
    return;
  }

  const trackerSection = document.getElementById("tracker-section");
  trackerSection.style.display = "block";
  trackerSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
  document.querySelector(".progress-bar").style.width = "40%";
  updateTrackerUI(req);
}

//current user ka id
const currentId = localStorage.getItem("currentId");

//define role tracker
function getRole(req) {
  if (String(currentId) === String(req?.donor?.user?._id)) {
    return "donor";
  }
  if (String(currentId) === String(req?.user?._id)) {
    return "patient";
  }

  return "unknown";
}

//Donor mein hospitals list show
const lists = document.getElementById("lists");
function hospitalDetails(hospitals) {
  lists.innerHTML = "";

  if (hospitals.length === 0) {
    lists.innerHTML = `<p>No hospital Select Patient</p>`;
    return;
  }
  hospitals.forEach((element) => {
    const div = document.createElement("div");

    div.className = "rule";

    div.innerHTML = `
      <li>${element}</li>
      <li class="r-checkbox">
        <input type="radio" name="hospital" value="${element}">
      </li>
    `;

    lists.appendChild(div);
  });
}

const hContactSection = document.getElementById("hospital-contact");
const dCompleteSection = document.getElementById("donation-complete");
const dCompleteBtn = document.getElementById("dCompleteBtn");
const cSubmit = document.getElementById("c-submit");
const hSubmit = document.getElementById("h-submit");

//db mein selected hospital save
async function saveSelectedHospital(id) {
  const selected = document.querySelector('input[name="hospital"]:checked');
  if (!selected) {
    alert("Select One Hospital Where are you want to donate blood");
    return;
  }

  const selectHospital = selected.value;

  try {
    const res = await fetch(BASE_URL + "/api/auth/select-hospital/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ selectHospital }),
    });

    const result = await res.json();
    console.log(result);
    if (res.ok && result.success === true) {
      alert("Hospital selected ✅");

      //  local data update (IMPORTANT)
      const req = window.allRequests.find((r) => String(r._id) === String(id));

      if (req) {
        req.selectedHospital = selectHospital;
        req.status = "confirmed";
      }

      //  UI re-render
      updateTrackerUI(req);
    }
  } catch (error) {
    console.log(error);
  }
}

//update contact details
async function saveContactDetails(id) {
  const date = document.getElementById("donation-date").value;

  if (!date) {
    alert("Select donation date ❌");
    return;
  }

  try {
    const res = await fetch(BASE_URL + "/api/auth/update-contact/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        donationDate: date,
      }),
    });

    const result = await res.json();

    if (res.ok && result.success) {
      alert("Contact details saved ✅");

      //  local update (IMPORTANT)
      const req = window.allRequests.find((r) => String(r._id) === String(id));

      if (req) {
        req.donationDate = date;
        req.contactedAt = new Date();
        req.status = "contacted";
      }

      //  UI update
      updateTrackerUI(req);
    }
  } catch (error) {
    console.log(error);
  }
}

// //update complete donation details
// async function saveCompleteDonation(id) {
//   const code = document.getElementById("dCode").value;

//   if (!code) {
//     alert("Enter Donation Code ❌");
//     return;
//   }

//   try {
//     const res = await fetch(BASE_URL + "/api/auth/complete-donation/" + id, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       credentials: "include",
//       body: JSON.stringify({
//         dCode: code,
//       }),
//     });

//     const result = await res.json();

//     if (res.ok && result.success) {
//       alert("Donation complete Thank you.. ✅");

//       //  local update (IMPORTANT)
//       const req = window.allRequests.find((r) => String(r._id) === String(id));

//       if (req) {
//         req.status = "completed";
//       }

//       //  UI update
//       updateTrackerUI(req);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

//call feature code here
function makeCall(number) {
  window.location.href = `tel:${number}`;
}

//whatsapp send message feature here
function sendWhatsApp(number) {
  const msg = "Hello, I am contacting regarding Rakht Seva.";

  const url = `https://wa.me/91${number}?text=${encodeURIComponent(msg)}`;

  window.open(url, "_blank");
}

//get remanining time
function getRemainingTime(contactedAt) {
  const now = new Date();
  const start = new Date(contactedAt);
  const target = new Date(start.getTime() + 24 * 60 * 60 * 1000);

  const diff = target - now;

  if (diff <= 0) return null;

  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

//counter code here
function startCountdown(contactedAt, elId) {
  const el = document.getElementById(elId);

  function update() {
    const time = getRemainingTime(contactedAt);

    if (!time) {
      el.innerText = "Ready to send code ✅";
      return;
    }

    el.innerText = `${time.hours}h ${time.minutes}m ${time.seconds}s`;
  }

  update();
  setInterval(update, 1000);
}

//check code send kar skte h ki nhi
function isReady(contactedAt) {
  const now = new Date();
  const start = new Date(contactedAt);

  const diff = now - start;

  const hours = diff / (1000 * 60 * 60);

  return hours >= 24;
}

//send donation code here
async function sendByDonorCode(id, email, req) {
  try {
    const res = await fetch(BASE_URL + "/api/auth/donor-send/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ patientEmail: email }),
    });

    const result = await res.json();
    alert(result.msg);
    if (res.ok && result.success) {
      verifyOpen = true;
      updateTrackerUI(req);
    }
  } catch (error) {
    console.log(error);
  }
}

async function sendByPatientCode(id, email, req) {
  try {
    const res = await fetch(BASE_URL + "/api/auth/patient-send/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ donorEmail: email }),
    });

    const result = await res.json();
    alert(result.msg);
    if (res.ok && result.success) {
      verifyOpen = true;
      updateTrackerUI(req);
    }
  } catch (error) {
    console.log(error);
  }
}

async function verifyMyCode(id, role, req) {
  const input = hContactSection.querySelector("#verify-input");
  const DCode = input.value;

  try {
    const res = await fetch(BASE_URL + "/api/auth/verify-donation-code/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ donationCode: DCode, role: role }),
    });
    const result = await res.json();

    if (res.ok && result.success === true) {
      req.donorCodeSent = true;
      req.status = "completed";
      updateTrackerUI(req);
    } else {
      alert(result.msg);
    }
  } catch (error) {
    console.log(error);
  }
}

//tracker UI code here
const stepsMap = {
  pending: 1,
  accepted: 2,
  confirmed: 3,
  contacted: 4,
  completed: 5,
};

function updateTrackerUI(req) {
  const role = getRole(req);
  const isVerifyOpen =
    role === "donor" ? req.donorCodeSent : req.patientCodeSent;

  //  sab section hide (reset)
  document.getElementById("lists").style.display = "none";
  document.getElementById("h-submit").style.display = "none";
  document.getElementById("hospital-contact").style.display = "none";
  dCompleteSection.style.display = "none";

  //  STEP BASED UI
  switch (req.status) {
    //  STEP 2 → accepted (hospital select)
    case "accepted":
      if (role === "donor") {
        hospitalDetails(req.hospitals);
        lists.style.display = "block";
        hSubmit.style.display = "block";

        hSubmit.onclick = () => {
          saveSelectedHospital(req._id);
        };
      }

      if (role === "patient") {
        lists.innerHTML = "⏳ Donor not selected hospital yet";
        lists.style.display = "block";
      }
      break;

    //  STEP 3 → confirmed (hospital selected)
    case "confirmed":
      if (role === "donor") {
        hContactSection.style.display = "block";
        const contactBtnBox = document.getElementById("call-message-btn");
        contactBtnBox.innerHTML = `
                <button onclick="makeCall('${req.user.mobileNumber}')" style="background-color: rgb(0, 198, 0);"><i
                  class="bi bi-telephone"></i> Call</button>
                <button onclick="sendWhatsApp('${req.user.mobileNumber}')" style="background-color: rgb(78, 78, 224);"><i class="bi bi-chat"></i>
                  Message
                </button>
        `;
        cSubmit.onclick = () => {
          saveContactDetails(req._id);
        };
      }

      if (role === "patient") {
        lists.innerHTML = `🏥 ${req.selectedHospital}`;
        lists.style.display = "block";
      }
      break;

    //  STEP 4 → contacted
    case "contacted":
      const ready = isReady(req.contactedAt);
      const date = new Date(req.donationDate);

      const formatted = date.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      hContactSection.style.display = "block";

      if (role === "donor") {
        hContactSection.innerHTML = `
          <p><b>Contact Details</b></p>

        <p>📍 ${req.user.username}</p>
        <p>📍 ${req.user.address}</p>
        <p>🏥 ${req.selectedHospital}</p>
        <p>📅 ${formatted}</p>

        <div class="contact-btn">
          <button onclick="makeCall('${req.user.mobileNumber}')" style="background-color: rgb(0, 198, 0);">📞 Call</button>
          <button onclick="sendWhatsApp('${req.user.mobileNumber}')" style="background-color: rgb(78, 78, 224);">💬 Message</button>
        </div>

        <hr>

        <p>⏳ Donation Code will be sent in: <b><span id="donor-timer"></span></b></p>
        <button id="donor-code-btn"
          style="
            margin-top:10px;
            padding:8px 16px;
            border:none;
            border-radius:8px;
            color:white;
            background:${ready ? "green" : "gray"};
            opacity:${ready ? "1" : "0.5"};
            cursor:${ready ? "pointer" : "not-allowed"};
          ">
          Send Donation Code
        </button>
        <div id="verify-section" style="display:${isVerifyOpen ? "block" : "none"}">
          <input type="text" id="verify-input" placeholder="Enter Code">
          <button id="verify-btn">Verify Code</button>
        </div>
        `;

        const verifyBtn = hContactSection.querySelector("#verify-btn");

        verifyBtn.onclick = () => {
          verifyMyCode(req._id, role, req);
        };

        startCountdown(req.contactedAt, "donor-timer");

        //when donor click donation code send
        const donorBtn = document.getElementById("donor-code-btn");
        if (ready) {
          donorBtn.onclick = () =>
            sendByDonorCode(req._id, req.user.email, req);
        } else {
          donorBtn.onclick = null;
        }
      }

      if (role === "patient") {
        hContactSection.innerHTML = `
          <p><b>Contact Details</b></p>

        <p>📍 ${req.donor.donorName}</p>
        <p>📍 ${req.donor.city}</p>
        <p>🏥 ${req.selectedHospital}</p>
        <h2>🏥 ${formatted}</h2>

        <div class="contact-btn">
          <button onclick="makeCall('${req.donor.mobileNumber}')" style="background-color: rgb(0, 198, 0);">📞 Call</button>
          <button onclick="sendWhatsApp('${req.donor.mobileNumber}')" style="background-color: rgb(78, 78, 224);">💬 Message</button>
        </div>

        <hr>

        <p>⏳ Donation Code will be sent in: <b><span id="patient-timer"></span></b></p>
        <button id="patient-code-btn"
          style="
            margin-top:10px;
            padding:8px 16px;
            border:none;
            border-radius:8px;
            color:white;
            background:${ready ? "green" : "gray"};
            opacity:${ready ? "1" : "0.5"};
            cursor:${ready ? "pointer" : "not-allowed"};
          ">
          Send Donation Code
        </button>

        <div id="verify-section" style="display:${isVerifyOpen ? "block" : "none"};">
          <input type="text" id="verify-input" placeholder="Enter Code">
          <button id="verify-btn">Verify Code</button>
        </div>
        `;

        const verifyBtn = hContactSection.querySelector("#verify-btn");

        verifyBtn.onclick = () => {
          verifyMyCode(req._id, role, req);
        };
        startCountdown(req.contactedAt, "patient-timer");

        //when patient click donation code send
        const patientBtn = document.getElementById("patient-code-btn");

        if (ready) {
          patientBtn.onclick = () =>
            sendByPatientCode(req._id, req.donor.user.email, req);
        } else {
          patientBtn.onclick = null;
        }
      }

      break;

    //  STEP 5 → completed
    case "completed":
      dCompleteSection.style.display = "block";

      const box = document.getElementById("complete-box");

      const isDonor = role === "donor";

      const title = "🩸 Donation Completed";

      const mainLine = isDonor
        ? "You just saved a life ❤️"
        : "You received help successfully ❤️";

      const desc = isDonor
        ? "Your kindness and courage made a real difference today. Every drop of blood you donated brings hope to someone in need."
        : "A donor stepped forward and helped you in your time of need. Humanity still shines through such acts of kindness.";

      const quote = isDonor
        ? "🌟 “Heroes don’t wear capes, they donate blood.”"
        : "🙏 “Kindness of strangers creates miracles.”";

      box.innerHTML = `
        <div style="
          text-align:center;
          padding:25px;
          border-radius:16px;
          background:linear-gradient(135deg,#e8f5e9,#c8e6c9);
          box-shadow:0 6px 20px rgba(0,0,0,0.1);
          margin-top:20px;
        ">

          <h2 style="color:#1b5e20;margin-bottom:10px;">
            ${title}
          </h2>

          <p style="font-size:16px;color:#2e7d32;margin-bottom:15px;">
            ${mainLine}
          </p>

          <p style="font-size:14px;color:#555;line-height:1.6;">
            ${desc}
          </p>

          <div style="
            margin:20px auto;
            padding:10px 15px;
            background:#ffffff;
            border-radius:10px;
            display:inline-block;
            font-size:13px;
            color:#666;
          ">
            ${quote}
          </div>

          <div style="margin-top:20px;">
            <button onclick="window.location.reload()"
              style="
                padding:10px 18px;
                border:none;
                border-radius:10px;
                background:#2e7d32;
                color:white;
                font-size:14px;
                cursor:pointer;
              ">
              Back to Dashboard
            </button>
          </div>

        </div>
      `;
      break;
  }

  //  PROGRESS BAR
  const step = stepsMap[req.status] || 1;
  const progress = (step / 5) * 100;

  document.querySelector(".progress-bar").style.width = progress + "%";

  //step par green 
  const currentStep = stepsMap[req.status] || 1;
  const buttons = document.querySelectorAll(".track-btn button");
  const lines = document.querySelectorAll(".line-div");

  buttons.forEach((btn, index) => {
    if (index < currentStep) {
      btn.style.backgroundColor = "green";
      btn.style.color = "white";
    } else {
      btn.style.backgroundColor = "lightgray";
      btn.style.color = "black";
    }
  });

  lines.forEach((line, index) => {
    if (index < currentStep - 1) {
      line.style.backgroundColor = "green";
    } else {
      line.style.backgroundColor = "lightgray";
    }
  });
}

document.getElementById("tracker-cancel").addEventListener("click", () => {
  document.getElementById("tracker-section").style.display = "none";
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("tracker-btn")) {
    const id = e.target.dataset.id;

    openTracker(id);
  }
});
