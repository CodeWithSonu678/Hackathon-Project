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
      if (role === "donor") {
        dCompleteSection.style.display = "block";
        dCompleteBtn.onclick = () => {
          saveCompleteDonation(req._id);
        };
      }

      if (role === "patient") {
        const date = new Date(req.donationDate);

        const formatted = date.toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        hContactSection.innerHTML = `
          <p><b>Contact Information</b></p>
            <div class="contact-btn">
                <button onclick="makeCall('${req.donor.mobileNumber}')" style="background-color: rgb(0, 198, 0);"><i
                  class="bi bi-telephone"></i> Call</button>
                <button onclick="sendWhatsApp('${req.donor.mobileNumber}')" style="background-color: rgb(78, 78, 224);"><i class="bi bi-chat"></i>
                  Message
                </button>
            </div>
        
        <h2>🏥 ${formatted}</h2>
        `;
        hContactSection.style.display = "block";
      }
      break;

    //  STEP 5 → completed
    case "completed":
      document.getElementById("tracker-section").innerHTML += `
        <p style="color:green;">✅ Donation Completed</p>
      `;
      break;
  }

  //  PROGRESS BAR
  const step = stepsMap[req.status] || 1;
  const progress = (step / 5) * 100;

  document.querySelector(".progress-bar").style.width = progress + "%";
}