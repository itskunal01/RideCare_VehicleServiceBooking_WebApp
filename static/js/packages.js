document.querySelector(".cta-btn").addEventListener("click", () => {
  window.location.href = "booking.html";
});



document.addEventListener("DOMContentLoaded", () => {
  const detailButtons = document.querySelectorAll(".details-btn");
  const bookButtons = document.querySelectorAll(".book-btn");

  
  detailButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".card");
      card.classList.toggle("expanded");
      btn.textContent = card.classList.contains("expanded")
        ? "Hide Details"
        : "View Details";
    });
  });

  
  bookButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".card");
      const packageName = card.querySelector("h3").textContent;
      alert(`You selected: ${packageName}\nRedirecting to booking page...`);
      
    });
  });
});


const CART_KEY = "ridecare_cart_v1";



document.querySelectorAll(".book-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".package-card");
    const id = card.dataset.id;
    const name = card.querySelector("h3").textContent.trim();
    const priceText = card.querySelector(".price").textContent.replace("₹", "").trim();
    const price = parseInt(priceText);

    
    const packageItem = [{ id, name, price }];

    
    localStorage.setItem(CART_KEY, JSON.stringify(packageItem));

    
    window.location.href = "/booking.html";
  });
});

