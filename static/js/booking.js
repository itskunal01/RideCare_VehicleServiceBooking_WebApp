// Lightweight helper: update totals when service type changes. Submission is
// handled by the Django form; do not block it here.
(function () {
  const serviceTypeRadios = document.querySelectorAll("input[name='service_type']");
  const servicesTotalEl = document.getElementById("servicesTotal");
  const doorstepFeeEl = document.getElementById("doorstepFee");
  const pickupFeeEl = document.getElementById("pickupFee");
  const grandTotalEl = document.getElementById("grandTotal");

  if (!servicesTotalEl || !grandTotalEl || serviceTypeRadios.length === 0) {
    return;
  }

  const updateGrandTotal = () => {
    const selected = document.querySelector("input[name='service_type']:checked");
    const type = selected ? selected.value : "doorstep";
    const serviceTotalText = servicesTotalEl.textContent.replace(/[^\d]/g, "");
    const serviceTotal = parseInt(serviceTotalText || "0", 10);

    const doorstepFee = type === "doorstep" ? 150 : 0;
    const pickupFee = type === "pickup_drop" ? 250 : 0;

    if (doorstepFeeEl) doorstepFeeEl.textContent = `₹${doorstepFee}`;
    if (pickupFeeEl) pickupFeeEl.textContent = `₹${pickupFee}`;
    grandTotalEl.textContent = `₹${serviceTotal + doorstepFee + pickupFee}`;
  };

  serviceTypeRadios.forEach(r => r.addEventListener("change", updateGrandTotal));
  updateGrandTotal();
})();
