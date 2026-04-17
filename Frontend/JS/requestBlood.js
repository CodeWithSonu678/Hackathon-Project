const BASE_URL = "http://127.0.0.1:3000";

//district list
let districts = [];

// 🔹 load all districts from DB
async function loadDistricts() {
  const res = await fetch(BASE_URL+"/api/auth/districts");
  const result = await res.json();
  districts = result.data;
}

loadDistricts();

function filterDistrict() {
  const input = document.getElementById("districtInput").value.toLowerCase();
  const list = document.getElementById("districtList");

  list.innerHTML = "";

  if (!input) return;

  const filtered = districts.filter((d) => {
    const district = d.toLowerCase();

    //  har word match kare
    return district.includes(input);
  });

  filtered.slice(0, 5).forEach((d) => {
    const li = document.createElement("li");
    li.textContent = d;

    li.onclick = () => {
      document.getElementById("districtInput").value = d;
      list.innerHTML = "";
      getHospitals(); //hospital load
    };

    list.appendChild(li);
  });
}

function validateDistrict() {
  const input = document.getElementById("districtInput").value;

  if (!districts.includes(input)) {
    alert("Please select valid district from list");
    return false;
  }

  return true;
}

//hopital list

async function getHospitals() {
  const district = document.getElementById("districtInput").value;

  if (!district) return;

  const res = await fetch(
    BASE_URL+`/api/auth/hospitals?district=${district}`,
  );
  const result = await res.json();
  const data = result.data;

  const dropdown = document.getElementById("hospitalDropdown");
  dropdown.innerHTML = "<option>Select Hospital</option>";

  data.forEach((h) => {
    const option = document.createElement("option");
    option.value = h.name;
    option.textContent = h.name;
    dropdown.appendChild(option);
  });
}

//selection of hospital
let selectedHospitals = [];

function addHospital() {
  const dropdown = document.getElementById("hospitalDropdown");
  const hospital = dropdown.value;

  if (!hospital) return;

  //  duplicate check
  if (selectedHospitals.includes(hospital)) {
    alert("Already selected");
    return;
  }

  //  max 5 limit
  if (selectedHospitals.length >= 5) {
    alert("Maximum 5 hospitals allowed");
    return;
  }

  //  add
  selectedHospitals.push(hospital);

  renderHospitals();
}

function renderHospitals() {
  const list = document.getElementById("selectedHospitals");
  list.innerHTML = "";

  selectedHospitals.forEach((h, index) => {
    const li = document.createElement("li");
    li.textContent = h;

    //  remove button
    const btn = document.createElement("button");
    btn.textContent = "❌";

    btn.onclick = () => {
      selectedHospitals.splice(index, 1);
      renderHospitals();
    };

    li.appendChild(btn);
    list.appendChild(li);
  });
}

//send request to backend
const requestBloodForm = document.getElementById("requestBloodForm");
const errorMessage = document.getElementById("error-message");

requestBloodForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMessage.innerText = "";

  const params = new URLSearchParams(window.location.search);
  const donorId = params.get("donorId");
  if (!donorId) {
    alert("Donor not selected!");
  }
  const data = {
    patientName: document.getElementById("patientName").value,
    age: document.getElementById("patientAge").value,
    aadharNumber: document.getElementById("aadharNumber").value,
    bloodGroup: document.getElementById("bloodGroup").value,
    district: document.getElementById("districtInput").value,
    hospitals: selectedHospitals,
    timePeriod: document.getElementById("timePeriod").value,
    unit: document.getElementById("unitNeeded").value,
    donorId: donorId,
  };

  console.log(data);

  try {
    const res = await fetch(BASE_URL+"/api/auth/request-blood", {
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
      errorMessage.textContent = result.msg || "Registered successfully ✅";

      setTimeout(() => {
        window.location.href = "../index.html";
      }, 2000);
    } else {
      errorMessage.className = "text-danger";

      if (result.msg) {
        errorMessage.textContent = result.msg || "Blood request failed ❌";
      } else if (result.errors && result.errors.length > 0) {
        errorMessage.textContent =
          result.errors[0].msg || "Blood request failed ❌";
      } else {
        errorMessage.textContent = "Somthing want worng ❌";
      }
    }
  } catch (error) {
    console.log(error);
    errorMessage.className = "text-danger";
    errorMessage.textContent = "Server error ❌";
  }
});
