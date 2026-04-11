const infoSection = document.getElementById("info-section");

//  load image
let url = ""
window.addEventListener("load", () => {
  const savedImg = localStorage.getItem("profileImg");

  if (savedImg) {
    url = savedImg;
  }
});

//dashboard info load
const loadInfoUser = async () => {
  try {
    const res = await fetch("https://hackathon-project-9jun.onrender.com/api/auth/get-user-info", {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();
    console.log(data);
    const userData = data.userData;

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

                infoSection.innerHTML += htmlTemplate;
  } catch (error) {
    console.log(error);
  }
};

loadInfoUser();


//All request load
async function loadAllRequest(){
        const container = document.getElementById("request-container");
        const card = document.getElementById("request-container");

        try {
                const res = await fetch("https://hackathon-project-9jun.onrender.com/api/auth/all-request", {
                        method: "GET",
                        credentials: "include"
                });

                const data = await res.json();

                data.allRequest.forEach(req => {
                
                card.className = "request-blood-card";

                card.innerHTML = `
                        <div class="request-inner" style="margin-left: 18px;">
                                <div class="request-img">
                                        <i class="bi bi-person-circle"></i>
                        </div>
                        <div class="request-name">
                                <span><b>Name: </b>${req.donor.donorName}</span>
                                <span><b>Age: </b>${req.donor.age}</span>
                                <span><b>Blood Group: </b>${req.donor.bloodGroup}</span>
                        </div>
                        </div>

                        <div class="request-inner">
                        <div class="request-info">
                                <p><b><i class="bi bi-geo-alt"></i></b> ${req.hospitals.join(", ")}</p>
                                <p><b><i class="bi bi-clock"></i></b> ${new Date(req._id).toLocaleDateString()}</p>
                        </div>

                        <div class="request-btn">
                                <button onclick="showTracker()">Tracker</button>
                        </div>
                        </div>
                `;

                        container.appendChild(card);
                })
        }catch (error) {
                console.log(error);
        }
}

loadAllRequest()

async function showTracker(){
        const trackerSection = document.getElementById("tracker-section");
        trackerSection.style.display = "block";
}