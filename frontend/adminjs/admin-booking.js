// -------------------------------
// ADMIN BOOKING MANAGEMENT JS
// -------------------------------

// Select all booking rows
const bookingRows = document.querySelectorAll(".booking-row");

// -------------------------------
// FILTER BOOKINGS
// -------------------------------

const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        // Highlight selected filter
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter; // e.g. pending, accepted, completed

        bookingRows.forEach(row => {
            const status = row.querySelector(".status").dataset.status;

            if (filter === "all" || status === filter) {
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

document.querySelectorAll(".accept-btn").forEach(btn => {
    btn.addEventListener("click", e => {
        const row = e.target.closest(".booking-row");
        updateStatus(row, "accepted");
        alert("Booking Accepted!");
    });
});


// -------------------------------
// REJECT BOOKING
// -------------------------------

document.querySelectorAll(".reject-btn").forEach(btn => {
    btn.addEventListener("click", e => {
        const row = e.target.closest(".booking-row");
        updateStatus(row, "rejected");
        alert("Booking Rejected!");
    });
});


// -------------------------------
// UPDATE STATUS (dropdown)
// -------------------------------

document.querySelectorAll(".status-dropdown").forEach(drop => {
    drop.addEventListener("change", e => {
        const row = e.target.closest(".booking-row");
        const newStatus = e.target.value;

        if (newStatus === "none") return;

        updateStatus(row, newStatus);
        alert(`Status updated: ${newStatus}`);
    });
});


// -------------------------------
// MAIN STATUS UPDATE FUNCTION
// -------------------------------

function updateStatus(row, status) {
    const statusCell = row.querySelector(".status");

    // Update text + dataset
    statusCell.textContent = statusToLabel(status);
    statusCell.dataset.status = status;

    // Reset classes
    statusCell.className = "status";

    // Add color class based on status
    statusCell.classList.add(`status-${status}`);
}


// -------------------------------
// UTILITY: STATUS LABELS
// -------------------------------

function statusToLabel(status) {
    switch (status) {
        case "pending": return "Pending";
        case "accepted": return "Accepted";
        case "progress": return "In Progress";
        case "completed": return "Completed";
        case "rejected": return "Rejected";
        default: return status;
    }
}
