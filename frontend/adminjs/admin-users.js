// ------- Dummy User Data (Replace later with Django API) ------
let users = [
    {
        id: 1,
        name: "Rohan Kumar",
        phone: "9876543210",
        bookings: 5,
        lastService: "2024-12-10",
        nextService: "2025-03-10",
        status: "active",
        address: "BTM Layout, Bangalore",
        bike: "Pulsar 150",
    },
    {
        id: 2,
        name: "Ayesha Khan",
        phone: "9123456780",
        bookings: 2,
        lastService: "2025-01-05",
        nextService: "2025-04-05",
        status: "blocked",
        address: "HSR Layout, Bangalore",
        bike: "Honda Activa 6G",
    }
];

// HTML Elements
const usersBody = document.getElementById("usersBody");
const searchUser = document.getElementById("searchUser");
const statusFilter = document.getElementById("statusFilter");
const modal = document.getElementById("userModal");
const modalDetails = document.getElementById("modalDetails");
const closeModal = document.getElementById("closeModal");

// -------------------- Render Users Table --------------------
function renderUsers() {
    usersBody.innerHTML = "";

    let searchValue = searchUser.value.toLowerCase();
    let filterValue = statusFilter.value;

    users
        .filter(user =>
            (filterValue === "all" || user.status === filterValue) &&
            (user.name.toLowerCase().includes(searchValue) ||
             user.phone.includes(searchValue))
        )
        .forEach(user => {
            let row = document.createElement("tr");

            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.phone}</td>
                <td>${user.bookings}</td>
                <td>${user.lastService}</td>
                <td>${user.nextService}</td>
                <td class="status-${user.status}">${user.status}</td>
                <td>
                    <button class="action-btn view-btn" onclick="viewUser(${user.id})">View</button>
                    ${
                        user.status === "active"
                        ? `<button class="action-btn block-btn" onclick="blockUser(${user.id})">Block</button>`
                        : `<button class="action-btn unblock-btn" onclick="unblockUser(${user.id})">Unblock</button>`
                    }
                </td>
            `;

            usersBody.appendChild(row);
        });
}

// -------------------- View User Details Popup --------------------
function viewUser(id) {
    const user = users.find(u => u.id === id);
    modalDetails.innerHTML = `
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p><strong>Address:</strong> ${user.address}</p>
        <p><strong>Bike:</strong> ${user.bike}</p>
        <p><strong>Total Bookings:</strong> ${user.bookings}</p>
        <p><strong>Last Service:</strong> ${user.lastService}</p>
        <p><strong>Next Service:</strong> ${user.nextService}</p>
    `;
    modal.classList.remove("hidden");
}

closeModal.addEventListener("click", () => modal.classList.add("hidden"));

// -------------------- Block / Unblock User --------------------
function blockUser(id) {
    users = users.map(u => u.id === id ? { ...u, status: "blocked" } : u);
    renderUsers();
}

function unblockUser(id) {
    users = users.map(u => u.id === id ? { ...u, status: "active" } : u);
    renderUsers();
}

// -------------------- Filters & Search Listeners --------------------
searchUser.addEventListener("input", renderUsers);
statusFilter.addEventListener("change", renderUsers);

// Initialize Table
renderUsers();
