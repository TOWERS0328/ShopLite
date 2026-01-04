const cartContainer = document.getElementById("cartContainer");
const cartTotal = document.getElementById("cartTotal");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderCart() {
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Tu carrito está vacío 🛒</p>";
    cartTotal.textContent = "$0";
    return;
  }

  let total = 0;

  cart.forEach((product, index) => {
    total += product.price;

    cartContainer.innerHTML += `
      <div class="cart-item">
        <img src="${product.thumbnail}" alt="${product.title}">
        <div class="cart-info">
          <h3>${product.title}</h3>
          <p>${product.category}</p>
        </div>
        <div>
          <p class="cart-price">$${product.price}</p>
          <button class="remove-btn" onclick="removeItem(${index})">
            Eliminar
          </button>
        </div>
      </div>
    `;
  });

  cartTotal.textContent = `$${total}`;
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

renderCart();
