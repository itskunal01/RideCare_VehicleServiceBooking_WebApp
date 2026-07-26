// =====================
// SERVICE MANAGEMENT JS
// =====================

// Modal elements
const serviceModal = document.getElementById("serviceModal");
const openServiceForm = document.getElementById("openServiceForm");
const closeServiceModal = document.getElementById("closeServiceModal");
const saveServiceBtn = document.getElementById("saveServiceBtn");

// Input fields
const serviceName = document.getElementById("serviceName");
const serviceDescription = document.getElementById("serviceDescription");
const servicePrice = document.getElementById("servicePrice");
const serviceTime = document.getElementById("serviceTime");

const servicesTableBody = document.getElementById("servicesTableBody");

let editIndex = null; // Track edit item index

// Open modal for ADD
openServiceForm.onclick = () => {
    editIndex = null;
    document.getElementById("modalTitle").innerText = "Add New Service";

    serviceName.value = "";
    serviceDescription.value = "";
    servicePrice.value = "";
    serviceTime.value = "";

    serviceModal.style.display = "flex";
};

// Close modal
closeServiceModal.onclick = () => {
    serviceModal.style.display = "none";
};

// Save Service (Add or Edit)
saveServiceBtn.onclick = () => {

    if (!serviceName.value || !serviceDescription.value || !servicePrice.value || !serviceTime.value) {
        alert("Please fill out all fields.");
        return;
    }

    const newRow = `
        <td>${serviceName.value}</td>
        <td>${serviceDescription.value}</td>
        <td>${servicePrice.value}</td>
        <td>${serviceTime.value}</td>
        <td>
            <button class="edit-btn" onclick="editService(this)">Edit</button>
            <button class="delete-btn" onclick="deleteService(this)">Delete</button>
        </td>
    `;

    if (editIndex === null) {
        // ADD NEW
        const row = document.createElement("tr");
        row.innerHTML = newRow;
        servicesTableBody.appendChild(row);

    } else {
        // UPDATE EXISTING
        servicesTableBody.rows[editIndex].innerHTML = newRow;
    }

    serviceModal.style.display = "none";
};

// Edit Service
function editService(button) {
    const row = button.parentElement.parentElement;
    editIndex = row.rowIndex - 1;

    document.getElementById("modalTitle").innerText = "Edit Service";

    serviceName.value = row.cells[0].innerText;
    serviceDescription.value = row.cells[1].innerText;
    servicePrice.value = row.cells[2].innerText;
    serviceTime.value = row.cells[3].innerText;

    serviceModal.style.display = "flex";
}

// Delete Service
function deleteService(button) {
    if (confirm("Are you sure you want to delete this service?")) {
        button.parentElement.parentElement.remove();
    }
}
