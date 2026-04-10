const mongoose = require("mongoose");

const connectDB = require("./src/db/db_connect");

//db connect
connectDB().then(() => {
  console.log("DB Connected");
  saveUPData();
});
// 🔹 Schema
const hospitalSchema = new mongoose.Schema({
  name: String,
  district: String,
  state: String,
  lat: Number,
  lon: Number
});

const Hospital = mongoose.model("Hospital", hospitalSchema);

// 🔹 OSM se hospitals
const fetchHospitals = async () => {
  const query = `
  [out:json];
  area["name"="Uttar Pradesh"]->.searchArea;
  (
    node["amenity"="hospital"](area.searchArea);
  );
  out;
  `;

  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query
  });

  const data = await response.json();
  return data.elements;
};

// 🔹 District nikaalna
const fetchDistrict = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          "User-Agent": "RakthSetuApp/1.0"
        }
      }
    );

    if (!response.ok) {
      console.log("Blocked or error:", response.status);
      return "Unknown";
    }

    const data = await response.json();

    return (
      data.address?.state_district ||
      data.address?.county ||
      data.address?.city ||
      "Unknown"
    );

  } catch (error) {
    console.error("Error fetching district:", error);
    return "Unknown";
  }
};

// 🔥 MAIN FUNCTION
const saveUPData = async () => {
  const hospitals = await fetchHospitals();

  console.log("Total hospitals:", hospitals.length);

  for (let h of hospitals) {
    if (!h.tags || !h.tags.name) continue;

    const district = await fetchDistrict(h.lat, h.lon);

    await Hospital.updateOne(
      { lat: h.lat, lon: h.lon }, // unique
      {
        name: h.tags.name,
        district: district,
        state: "Uttar Pradesh",
        lat: h.lat,
        lon: h.lon
      },
      { upsert: true }
    );

    console.log("Saved:", h.tags.name);

    // ⚠️ delay (important)
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log("UP Data Saved ✅");
  process.exit();
};
