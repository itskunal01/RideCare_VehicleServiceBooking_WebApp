// Admin booking management: filter rows and persist status changes to backend.
(function () {
  const bookingRows = document.querySelectorAll(".booking-row");
  const filterButtons = document.querySelectorAll(".filter-btn");

  const statusMap = {
    pending: "pending",
    accepted: "confirmed",
    confirmed: "confirmed",
    in_progress: "in_progress",
    completed: "completed",
    cancelled: "cancelled",
    rejected: "cancelled",
  };

  function getCookie(name) {
    const cookies = document.cookie ? document.cookie.split("; ") : [];
    for (const c of cookies) {
      const [k, v] = c.split("=");
      if (k === name) return decodeURIComponent(v);
    }
    return null;
  }

  function statusToLabel(status) {
    switch (status) {
      case "pending": return "Pending";
      case "confirmed": return "Accepted";
      case "in_progress": return "In Progress";
      case "completed": return "Completed";
      case "cancelled": return "Cancelled";
      default: return status;
    }
  }

  function applyStatusToRow(row, status) {
    const statusCell = row.querySelector(".status");
    statusCell.textContent = statusToLabel(status);
    statusCell.dataset.status = status;
    statusCell.className = "status";
    statusCell.classList.add(`status-${status}`);
    row.dataset.status = status;
  }

  async function persistStatus(row, requestedStatus) {
    const bookingId = row.dataset.bookingId;
    const normalized = statusMap[requestedStatus] || requestedStatus;

    const csrf = getCookie("csrftoken");
    const formData = new FormData();
    formData.append("booking_id", bookingId);
    formData.append("status", normalized);

    const resp = await fetch("/admin/bookings/update-status/", {
      method: "POST",
      headers: {
        "X-CSRFToken": csrf || "",
      },
      body: formData,
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.error || "Failed to update status");
    }
    const data = await resp.json();
    applyStatusToRow(row, data.status);
  }

  // Filters
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;

      bookingRows.forEach(row => {
        const status = row.dataset.status;
        if (filter === "all" || status === filter) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    });
  });

  // Accept / Reject buttons
  document.querySelectorAll(".accept-btn").forEach(btn => {
    btn.addEventListener("click", async e => {
      const row = e.target.closest(".booking-row");
      try {
        await persistStatus(row, "accepted");
        alert("Booking Accepted!");
      } catch (err) {
        alert(err.message);
      }
    });
  });

  document.querySelectorAll(".reject-btn").forEach(btn => {
    btn.addEventListener("click", async e => {
      const row = e.target.closest(".booking-row");
      try {
        await persistStatus(row, "rejected");
        alert("Booking Rejected!");
      } catch (err) {
        alert(err.message);
      }
    });
  });

  // Dropdown updates
  document.querySelectorAll(".status-dropdown").forEach(drop => {
    drop.addEventListener("change", async e => {
      const row = e.target.closest(".booking-row");
      const newStatus = e.target.value;
      if (newStatus === "none") return;
      try {
        await persistStatus(row, newStatus);
        alert(`Status updated: ${statusToLabel(statusMap[newStatus] || newStatus)}`);
      } catch (err) {
        alert(err.message);
      } finally {
        e.target.value = "none";
      }
    });
  });
})();
