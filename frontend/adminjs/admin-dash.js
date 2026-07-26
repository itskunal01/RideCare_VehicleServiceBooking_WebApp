// -------------------------------
// ADMIN BOOKING MANAGEMENT JS
// -------------------------------

// Fetch all rows
const rows = document.querySelectorAll(".bookings-table tbody tr");

// -------------------------------
// FILTER BOOKINGS
// -------------------------------
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        // Remove active
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.textContent.trim();

        rows.forEach(row => {
            const statusEl = row.querySelector(".status");
            const status = statusEl.textContent.trim();

            if (filter === "All" || status === filter) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });
});


// -------------------------------
// ACCEPT BOOKING
// -------------------------------
document.querySelectorAll(".accept").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const row = e.target.closest("tr");
        const statusEl = row.querySelector(".status");

        statusEl.textContent = "Accepted";
        statusEl.className = "status accepted";

        alert("Booking Accepted!");
    });
});


// -------------------------------
// REJECT BOOKING
// -------------------------------
document.querySelectorAll(".reject").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const row = e.target.closest("tr");
        const statusEl = row.querySelector(".status");

        statusEl.textContent = "Rejected";
        statusEl.className = "status rejected";

        alert("Booking Rejected!");
    });
});


// -------------------------------
// STATUS UPDATE DROPDOWN
// -------------------------------
document.querySelectorAll(".status-dropdown").forEach(drop => {
    drop.addEventListener("change", (e) => {
        const row = e.target.closest("tr");
        const statusEl = row.querySelector(".status");
        const newStatus = e.target.value;

        if (newStatus === "Update Status") return;

        // Reset class
        statusEl.className = "status";

        // Update based on selected value
        if (newStatus === "Pending") {
            statusEl.classList.add("pending");
        } else if (newStatus === "Accepted") {
            statusEl.classList.add("accepted");
        } else if (newStatus === "In Progress") {
            statusEl.classList.add("progress");
        } else if (newStatus === "Completed") {
            statusEl.classList.add("completed");
        }

        statusEl.textContent = newStatus;

        alert(`Status updated to: ${newStatus}`);
    });
});
