// =====================
// PACKAGE MANAGEMENT JS
// =====================

// Modal elements
const packageModal = document.getElementById("packageModal");
const openPackageForm = document.getElementById("openPackageForm");
const closePackageModal = document.getElementById("closePackageModal");
const savePackageBtn = document.getElementById("savePackageBtn");

// Input fields
const packageName = document.getElementById("packageName");
const packageDescription = document.getElementById("packageDescription");
const packagePrice = document.getElementById("packagePrice");
const packageServices = document.getElementById("packageServices");

const packagesTableBody = document.getElementById("packagesTableBody");

let packageEditIndex = null;

// Open modal for ADD
openPackageForm.onclick = () => {
    packageEditIndex = null;

    document.getElementById("packageModalTitle").innerText = "Add New Package";

    packageName.value = "";
    packageDescription.value = "";
    packagePrice.value = "";
    packageServices.value = "";

    packageModal.style.display = "flex";
};

// Close modal
closePackageModal.onclick = () => {
    packageModal.style.display = "none";
};

// Save Package (Add or Edit)
savePackageBtn.onclick = () => {

    if (!packageName.value || !packageDescription.value || !packagePrice.value || !packageServices.value) {
        alert("Please fill all fields!");
        return;
    }

    const newRow = `
        <td>${packageName.value}</td>
        <td>${packageDescription.value}</td>
        <td>${packagePrice.value}</td>
        <td>${packageServices.value}</td>
        <td>
            <button class="edit-btn" onclick="editPackage(this)">Edit</button>
            <button class="delete-btn" onclick="deletePackage(this)">Delete</button>
        </td>
    `;

    if (packageEditIndex === null) {
        const row = document.createElement("tr");
        row.innerHTML = newRow;
        packagesTableBody.appendChild(row);

    } else {
        packagesTableBody.rows[packageEditIndex].innerHTML = newRow;
    }

    packageModal.style.display = "none";
};

// Edit Package
function editPackage(button) {
    const row = button.parentElement.parentElement;
    packageEditIndex = row.rowIndex - 1;

    document.getElementById("packageModalTitle").innerText = "Edit Package";

    packageName.value = row.cells[0].innerText;
    packageDescription.value = row.cells[1].innerText;
    packagePrice.value = row.cells[2].innerText;
    packageServices.value = row.cells[3].innerText;

    packageModal.style.display = "flex";
}

// Delete Package
function deletePackage(button) {
    if (confirm("Do you really want to delete this package?")) {
        button.parentElement.parentElement.remove();
    }
}
