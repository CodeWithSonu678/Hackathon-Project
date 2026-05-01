const BASE_URL = "https://rakht-seva.onrender.com";

//donor info show
function moreInfo(d) {
  document.getElementById("dName").innerText = d.donorName;
  document.getElementById("dPhone").innerText = d.mobileNumber;
  document.getElementById("dEmail").innerText = d.userData.email;

  document.getElementById("dBlood").innerText = d.bloodGroup;
  document.getElementById("dCity").innerText = d.city;
  document.getElementById("dDistance").innerText =
    d.distanceInKm.toFixed(2) + " km";

  document.getElementById("donorModal").style.display = "flex";
}

// close
function closeModal() {
  document.getElementById("donorModal").style.display = "none";
}

async function getCoordsSmart(query) {
  try {
    //  1st try (full query)
    let res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1`
    );
    let data = await res.json();

    //  2nd try (last word = city)
    if (!data.length) {
      const words = query.trim().split(" ");
      const city = words[words.length - 1];

      res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${city}&format=json`
      );
      data = await res.json();
    }

    if (!data.length) return null;

    const place =
      data.find(p =>
        ["city", "town", "village"].includes(p.type)
      ) ||
      data.find(p =>
        ["college", "hospital", "school", "university"].includes(p.type)
      ) ||
      data[0];

    return {
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
      name: place.display_name,
    };

  } catch (error) {
    console.log(error);
    return null;
  }
}

//when user find donor
const searchDonor = document.getElementById("searchDonor");

const map = L.map("map").setView([26.8467, 80.9462], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

//when click search btn
searchDonor.addEventListener("submit", async (e) => {
  e.preventDefault();

  const city = document.getElementById("cityInput").value;
  const bloodGroup = document.getElementById("bloodGroup").value;

  let searchLat, searchLng;

  try {

    //  STEP 1: SEARCH LOCATION
    if (city) {
      const coords = await getCoordsSmart(city);
      if (!coords) {
        alert("Location not found");
        return;
      }
      searchLat = coords.lat;
      searchLng = coords.lng;
    } else {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      searchLat = pos.coords.latitude;
      searchLng = pos.coords.longitude;
    }

    //  STEP 2: MAP CENTER
    map.flyTo([searchLat, searchLng], 12);

    //  STEP 3: API CALL
    const res = await fetch(BASE_URL + "/api/auth/donor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        bloodGroup,
        lat: searchLat,
        lng: searchLng,
        city,
      }),
    });

    const result = await res.json();
    const donors = result.data;

    console.log("Donors:", donors);

    //  STEP 4: CLEAR OLD MARKERS
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    //  STEP 5: UI
    const donorContainer = document.getElementById("donorContainer");
    donorContainer.style.display = "block";
    donorContainer.innerHTML = "";

    if (donors.length === 0) {
      donorContainer.innerHTML = "<p>No donor found!</p>";
      return;
    }

    //  STEP 6: MARKERS + CARDS
    donors.forEach((element) => {
      const lng = element.location.coordinates[0];
      const lat = element.location.coordinates[1];

      L.marker([lat, lng]).addTo(map)
        .bindPopup(`
          <b>${element.donorName}</b><br/>
          ${element.distanceInKm.toFixed(2)} km away
        `);

      donorContainer.innerHTML += `
        <div class="donor-card">
          <div class="donor-id">
            <i class="bi bi-person-circle" style="font-size: 60px;"></i>

            <p><b>${element.donorName}</b></p>
            <p>${element.distanceInKm.toFixed(2)} km away</p>

            <button class="bl-btn">
              <a href="requestBlood.html?donorId=${element._id}">Request</a>
            </button>

            <button onclick='moreInfo(${JSON.stringify(element)})' class="bl-btn">
              More Info
            </button>
          </div>
        </div>
      `;
    });

  } catch (error) {
    console.log(error);
  }
});
//Review code here

const reviewForm = document.getElementById("reviewForm");
const errorMessage = document.getElementById("error-message");
const stars = document.querySelectorAll("#starRating i");
const starInput = document.getElementById("starInput");

stars.forEach((star) => {
  star.addEventListener("click", () => {
    const value = star.getAttribute("data-value");
    starInput.value = value;

    //reset
    stars.forEach((s) => {
      s.classList.remove("active");
    });

    //fill star
    stars.forEach((s) => {
      if (s.getAttribute("data-value") <= value) {
        s.classList.add("active");
      }
    });
  });
});

reviewForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMessage.textContent = "";

  const data = {
    rating: starInput.value,
    reviewMessage: document.getElementById("reviewMessage").value,
  };

  try {
    const res = await fetch(BASE_URL + "/api/auth/review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok && result.success === true) {
      errorMessage.className = "text-success";
      errorMessage.innerText = result.msg || "Thanks for your review";

      errorMessage.style.transition = "opacity 0.5s";
      errorMessage.style.opacity = "1";

      reviewForm.reset();
      document.getElementById("starInput").value = 0;

      const stars = document.querySelectorAll("#starRating i");
      stars.forEach((s) => s.classList.remove("active"));
      setTimeout(() => {
        window.location.href = "#reviewList";
        errorMessage.textContent = "";
        loadReviews();
      }, 2000);
    } else {
      errorMessage.className = "text-danger";

      if (result.errors && result.errors.length > 0) {
        errorMessage.textContent =
          result.errors[0].msg || "Review add failed ❌";
      } else if (result.msg) {
        errorMessage.textContent = result.msg;
      } else {
        errorMessage.textContent = "Somthing want worng ❌";
      }
    }
  } catch (error) {
    console.log(error);
  }
});

//load review users
async function loadReviews() {
  try {
    const res = await fetch(BASE_URL + "/api/auth/reviews", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      credentials: "include",
    });
    const result = await res.json();

    const reviews = result.data;

    const container = document.getElementById("reviewList");
    container.innerHTML = "";

    reviews.forEach((r) => {
      const card = document.createElement("div");
      card.className = "review-card-body";

      const stars = "⭐".repeat(r.rating);
      card.innerHTML = `
        <div class="review-star">
          <div class="stars">${stars}</div>
          <hr>
        </div>

        <div class="review-txt">
          <span><i>"${r.reviewMessage}"</i></span>
          <hr>
        </div>

        <div class="reviewer-profile">
          <div class="reviewer-img">
            <i class="bi bi-person-circle"></i>
          </div>

          <div class="reviwer-info">
            <p style="margin: 0px;"><b>${r.user.username}</b></p>
            <p style="margin: 0px;">Donor</p>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.log(error);
  }
}

loadReviews();
