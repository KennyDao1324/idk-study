
const categories = [
  { icon: "🧄", name: "Tỏi" },
  { icon: "🥬", name: "Rau củ" },
  { icon: "🥩", name: "Thịt" },
  { icon: "🥚", name: "Trứng" },
  { icon: "🧄", name: "Tỏi đen" },
  { icon: "🧂", name: "Gia vị" },
  { icon: "🍯", name: "Tỏi ngâm" },
  { icon: "📦", name: "Combo" },
];

const dealProducts = [
  { id: "d1", name: "Tỏi củ tươi Đà Lạt", unit: "ĐVT: Kg", price: 52000, discount: "-16%", emoji: "🧄" },
  { id: "d2", name: "Tỏi bóc vỏ sạch", unit: "ĐVT: Hộp", price: 65000, discount: "-17%", emoji: "🧄" },
];

const newProducts = [
  { id: "n1", name: "Tỏi đen (200g)", unit: "ĐVT: Gói", price: 99000, discount: "Mới", emoji: "🧄" },
  { id: "n2", name: "Bột tỏi (250g)", unit: "ĐVT: Hũ", price: 38000, discount: "Mới", emoji: "🧂" },
];

const weekProducts = [
  { id: "w1", name: "[Thùng] Tỏi bóc vỏ (1kg) x 2", unit: "1kg x 2 gói", price: 179000, discount: "-10%", emoji: "📦" },
  { id: "w2", name: "Combo tỏi củ + bột tỏi", unit: "Combo", price: 129000, discount: "-12%", emoji: "📦" },
];

// cartQty: { productId: qty }
const cartQty = {};

const categoryGrid = document.getElementById("categoryGrid");
const dealGrid = document.getElementById("dealGrid");
const newGrid = document.getElementById("newGrid");
const weekGrid = document.getElementById("weekGrid");
const cartBadge = document.getElementById("cartBadge");
const searchInput = document.getElementById("searchInput");

function moneyVND(n){
  return new Intl.NumberFormat("vi-VN").format(n) + "₫";
}

function renderCategories(){
  categoryGrid.innerHTML = "";
  categories.forEach(c => {
    const el = document.createElement("div");
    el.className = "cat";
    el.innerHTML = `<div class="ico">${c.icon}</div><div class="txt">${c.name}</div>`;
    categoryGrid.appendChild(el);
  });
}

function productCard(p){
  const qty = cartQty[p.id] || 0;
  const isDeal = p.discount && p.discount.startsWith("-");
  const discountText = p.discount || "";

  return `
    <article class="pcard" data-name="${p.name.toLowerCase()}">
      <div class="discount">${discountText}</div>
      <button class="heart" type="button" title="Yêu thích">♡</button>

      <div class="p-top">
        <div class="p-img">${p.emoji || "🧄"}</div>
      </div>

      <div class="p-body">
        <div class="p-name">${p.name}</div>
        <div class="p-unit">${p.unit}</div>

        <div class="p-price">${moneyVND(p.price)}</div>
        <div class="p-vat">(Chưa bao gồm VAT)</div>

        <div class="stepper">
          <button type="button" class="minus" data-action="minus" data-id="${p.id}">-</button>
          <div class="qty" id="qty-${p.id}">${qty}</div>
          <button type="button" class="plus" data-action="plus" data-id="${p.id}">+</button>
        </div>
      </div>
    </article>
  `;
}

function renderSection(gridEl, list){
  gridEl.innerHTML = list.map(productCard).join("");
}

function updateBadge(){
  const total = Object.values(cartQty).reduce((a,b)=>a+b,0);
  cartBadge.textContent = total;
}

function setQty(id, value){
  cartQty[id] = Math.max(0, value);
  const qtyEl = document.getElementById("qty-" + id);
  if (qtyEl) qtyEl.textContent = cartQty[id];
  updateBadge();
}

// Handle + and -
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;

  const id = btn.dataset.id;
  const action = btn.dataset.action;
  const current = cartQty[id] || 0;

  if (action === "plus") setQty(id, current + 1);
  if (action === "minus") setQty(id, current - 1);
});

// Simple search: hide cards that don’t match
searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  document.querySelectorAll(".pcard").forEach(card => {
    const name = card.getAttribute("data-name") || "";
    card.style.display = name.includes(q) ? "" : "none";
  });
});

// Init
renderCategories();
renderSection(dealGrid, dealProducts);
renderSection(newGrid, newProducts);
renderSection(weekGrid, weekProducts);
updateBadge();