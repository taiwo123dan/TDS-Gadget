let cart = [];

function showSection(sectionId) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(sectionId).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (sectionId === "cart") updateCart();
}

// ADD TO CART
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-to-cart")) {
    const card = e.target.closest(".product-card");
    const name = card.querySelector("h3").textContent;
    const priceText = card.querySelector("p").textContent.replace("₦", "").replace(",", "");
    const price = parseFloat(priceText);
    const size = card.querySelector("select").value;
    const qty = parseInt(card.querySelector('input[type="number"]').value);
    const colorOption = card.querySelector(".color-option span")?.textContent || "Default";

    if (size === "Select Size") {
      alert("Please select a size.");
      return;
    }

    const existing = cart.find(item => item.name === name && item.size === size && item.color === colorOption);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ name, price, qty, size, color: colorOption });
    }

    alert(`${name} added to cart!`);
  }
});

// UPDATE CART
function updateCart() {
  const tbody = document.getElementById("cart-items");
  tbody.innerHTML = "";

  if (cart.length === 0) {
    tbody.innerHTML = "<tr><td colspan='4'>Your cart is empty.</td></tr>";
    return;
  }

  cart.forEach((item, index) => {
    const total = item.price * item.qty;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}<br><small>${item.color}, ${item.size}</small></td>
      <td>₦${item.price.toLocaleString()}</td>
      <td>
        <input type="number" min="1" value="${item.qty}" data-index="${index}" class="update-qty">
        <button class="remove-item" data-index="${index}">Remove</button>
      </td>
      <td>₦${total.toLocaleString()}</td>
    `;
    tbody.appendChild(row);
  });

  const grandTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalRow = document.createElement("tr");
  totalRow.innerHTML = `
    <td colspan="3" style="text-align:right; font-weight:bold;">Grand Total:</td>
    <td style="font-weight:bold;">₦${grandTotal.toLocaleString()}</td>
  `;
  tbody.appendChild(totalRow);
}

// HANDLE CART ACTIONS
document.addEventListener("input", function (e) {
  if (e.target.classList.contains("update-qty")) {
    const index = e.target.dataset.index;
    const newQty = parseInt(e.target.value);
    cart[index].qty = newQty > 0 ? newQty : 1;
    updateCart();
  }
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-item")) {
    const index = e.target.dataset.index;
    cart.splice(index, 1);
    updateCart();
  }
});
// Color selection logic
document.querySelectorAll('.color-options').forEach(optionGroup => {
  const colorSwatches = optionGroup.querySelectorAll('.color-swatch');
  const selectedText = optionGroup.parentElement.querySelector('.selected-color');

  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      // remove previous selection
      colorSwatches.forEach(s => s.classList.remove('selected'));
      // mark this one as selected
      swatch.classList.add('selected');
      // update text
      selectedText.textContent = `Selected color: ${swatch.dataset.color}`;
    });
  });
});
