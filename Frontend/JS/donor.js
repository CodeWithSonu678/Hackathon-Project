const BASE_URL = "http://127.0.0.1:3000";
const donorForm = document.getElementById("donorForm");
const errorMessage = document.getElementById("error-message");


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
    const res = await fetch(BASE_URL+"/api/auth/donate-form",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        credentials: "include",
        body:JSON.stringify(data)
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
  } catch (error) {
    console.log(error)
  }
});


