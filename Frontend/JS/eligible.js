const BASE_URL = "https://rakht-seva.onrender.com";

const eligibleForm = document.getElementById("eligibleForm");
const errorMessage = document.getElementById("error-message");


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
