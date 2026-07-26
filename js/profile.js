// --- Dummy user & service data (to replace later with Django data) ---
const user = {
  name: "John Doe",
  email: "johndoe@email.com",
  address: "123 MG Road, Pune"
};

const pastServices = [
  { date: "2025-07-05", name: "Premium Care Package", amount: 1799, status: "Completed" },
  { date: "2025-04-02", name: "Basic Maintenance Package", amount: 999, status: "Completed" }
];

// --- Load Profile Info ---
document.getElementById("userName").textContent = user.name;
document.getElementById("userEmail").textContent = user.email;
document.getElementById("userAddress").textContent = user.address;

// --- Populate past services ---
const tbody = document.querySelector("#pastServicesTable tbody");
pastServices.forEach(svc => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${svc.date}</td>
    <td>${svc.name}</td>
    <td>₹${svc.amount}</td>
    <td>${svc.status}</td>
  `;
  tbody.appendChild(row);
});

// --- Upcoming service calculation ---
function getNextServiceDate(lastDate, intervalDays) {
  const date = new Date(lastDate);
  date.setDate(date.getDate() + intervalDays);
  return date.toISOString().split("T")[0];
}

const lastServiceDate = pastServices[0].date;
const intervalSelect = document.getElementById("serviceInterval");
const nextServiceDateEl = document.getElementById("nextServiceDate");
document.getElementById("lastServiceDate").textContent = lastServiceDate;

// initial calculation
nextServiceDateEl.textContent = getNextServiceDate(lastServiceDate, parseInt(intervalSelect.value));

// update on change
intervalSelect.addEventListener("change", () => {
  nextServiceDateEl.textContent = getNextServiceDate(lastServiceDate, parseInt(intervalSelect.value));
});

// --- Profile photo upload ---
document.getElementById("changePhotoBtn").addEventListener("click", () => {
  document.getElementById("photoUpload").click();
});

document.getElementById("photoUpload").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      document.getElementById("profilePhoto").src = evt.target.result;
    };
    reader.readAsDataURL(file);
  }
});
