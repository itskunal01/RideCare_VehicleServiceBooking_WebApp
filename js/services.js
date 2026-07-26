document.querySelector(".cta-btn").addEventListener("click", () => {
  window.location.href = "booking.html";
});





const addButtons = document.querySelectorAll(".add-btn");
const cartItemsContainer = document.getElementById("cartItems");
const cartSummary = document.getElementById("cartSummary");
const cartTotal = document.getElementById("cartTotal");
const proceedBtn = document.getElementById("proceedBtn");
const clearBtn = document.getElementById("clearBtn");

const CART_KEY = "ridecare_cart_v1";
let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];


addButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".card");
    const id = card.dataset.id;
    const name = card.querySelector("h3").textContent;
    const priceText = card.querySelector(".price").textContent.replace("₹", "");
    const price = parseInt(priceText);

    const index = cart.findIndex(item => item.id === id);
    if (index === -1) {
      cart.push({ id, name, price });
      btn.textContent = "Added";
      btn.classList.add("added");
    } else {
      cart.splice(index, 1);
      btn.textContent = "Add";
      btn.classList.remove("added");
    }

    updateCart();
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  });
});


function updateCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<div class="muted small">No services added yet.</div>`;
    cartSummary.style.display = "none";
  } else {
    cart.forEach(item => {
      const row = document.createElement("div");
      row.innerHTML = `<span>${item.name}</span><span>₹${item.price}</span>`;
      cartItemsContainer.appendChild(row);
      total += item.price;
    });
    cartSummary.style.display = "block";
  }

  cartTotal.textContent = `₹${total}`;
  updateMobileCart();
  updateDrawerCart();
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}


clearBtn.addEventListener("click", () => {
  cart = [];
  localStorage.removeItem(CART_KEY);
  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.textContent = "Add";
    btn.classList.remove("added");
  });
  updateCart();
});


proceedBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Please select at least one service before proceeding.");
    return;
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.location.href = "/booking.html"; 
});



const mobileCartBar = document.getElementById("mobileCartBar");
const mobileCount = document.getElementById("mobileCount");
const mobileTotal = document.getElementById("mobileTotal");
const openDrawer = document.getElementById("openDrawer");

function updateMobileCart() {
  if (cart.length > 0) {
    mobileCartBar.setAttribute("aria-hidden", "false");
    mobileCount.textContent = `${cart.length} services`;
    const sum = cart.reduce((acc, i) => acc + i.price, 0);
    mobileTotal.textContent = `₹${sum}`;
  } else {
    mobileCartBar.setAttribute("aria-hidden", "true");
  }
}

if (openDrawer) {
  openDrawer.addEventListener("click", () => (drawer.style.display = "flex"));
}



const drawer = document.getElementById("drawer");
const closeDrawer = document.getElementById("closeDrawer");
const drawerBody = document.getElementById("drawerBody");
const drawerCount = document.getElementById("drawerCount");
const drawerTotal = document.getElementById("drawerTotal");
const drawerClear = document.getElementById("drawerClear");
const drawerProceed = document.getElementById("drawerProceed");

if (closeDrawer) {
  closeDrawer.addEventListener("click", () => (drawer.style.display = "none"));
}

function updateDrawerCart() {
  drawerBody.innerHTML = "";
  drawerCount.textContent = `${cart.length} items`;

  if (cart.length === 0) {
    drawerBody.innerHTML = `<div class="muted">No items selected yet.</div>`;
  } else {
    cart.forEach(item => {
      const div = document.createElement("div");
      div.style.display = "flex";
      div.style.justifyContent = "space-between";
      div.style.marginBottom = "0.5rem";
      div.innerHTML = `<span>${item.name}</span><span>₹${item.price}</span>`;
      drawerBody.appendChild(div);
    });
  }

  const sum = cart.reduce((acc, i) => acc + i.price, 0);
  drawerTotal.textContent = `₹${sum}`;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

drawerClear.addEventListener("click", () => {
  cart = [];
  localStorage.removeItem(CART_KEY);
  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.textContent = "Add";
    btn.classList.remove("added");
  });
  updateCart();
  drawer.style.display = "none";
});

drawerProceed.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Please select at least one service.");
    return;
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.location.href = "/booking.html"; 
});



const detailsButtons = document.querySelectorAll(".details-btn");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalAdd = document.getElementById("modalAdd");

detailsButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".card");
    const name = card.querySelector("h3").textContent;
    const desc = card.querySelector(".desc").textContent;
    modalTitle.textContent = name;
    modalBody.textContent = desc;
    modalBackdrop.style.display = "flex";
    modalAdd.dataset.id = card.dataset.id;
  });
});

modalClose.addEventListener("click", () => {
  modalBackdrop.style.display = "none";
});

modalAdd.addEventListener("click", () => {
  const id = modalAdd.dataset.id;
  const btn = document.querySelector(`.add-btn[data-id="${id}"]`);
  btn.click();
  modalBackdrop.style.display = "none";
});


updateCart();
