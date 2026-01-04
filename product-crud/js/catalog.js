const productList = document.getElementById("productList");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("categoryFilter");

// MODAL
const modal = document.getElementById("productModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const modalStock = document.getElementById("modalStock");
const modalCategory = document.getElementById("modalCategory");
const closeModal = document.querySelector(".close-modal");
const cartCount = document.getElementById("cartCount");

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cartCount) cartCount.textContent = cart.length;
}

updateCartCount();



let products = [];

/* ================= OBTENER PRODUCTOS ================= */
async function getProducts() {
  try {
    const res = await fetch(
      "https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/products.json"
    );
    const data = await res.json();

    // Normalizar datos
    products = data.map((product, index) => ({
      id: index,
      title: product.name,
      description: product.description || "Producto de excelente calidad.",
      price: product.price,
      category: product.category,
      thumbnail: product.image,
      stock: product.stock ?? "Disponible"
    }));

    loadCategories(products);
    renderProducts(products);
  } catch (error) {
    productList.innerHTML = "<p>Error al cargar productos</p>";
    console.error(error);
  }
}

/* ================= CATEGORÍAS ================= */
function loadCategories(products) {
  categoryFilter.innerHTML = `<option value="all">Todas las categorías</option>`;

  const categories = [...new Set(products.map(p => p.category))];

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

/* ================= RENDER PRODUCTOS ================= */
function renderProducts(list) {
  productList.innerHTML = "";

  list.forEach(product => {
    productList.innerHTML += `
      <div class="card">
        <img 
          src="${product.thumbnail}" 
          alt="${product.title}"
          onclick="openModal(${product.id})"
        >
        <div class="card-body">
          <span class="badge">${product.category}</span>
          <h3>${product.title}</h3>
          <p class="price">$ ${product.price}</p>
          <p class="stock">Stock: ${product.stock}</p>
        </div>
      </div>
    `;
  });
}

/* ================= MODAL ================= */
function openModal(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  modalImage.src = product.thumbnail;
  modalTitle.textContent = product.title;
  modalDescription.textContent = product.description;
  modalPrice.textContent = `$ ${product.price}`;
  modalStock.textContent = `Stock: ${product.stock}`;
  modalCategory.textContent = product.category;

  modal.classList.add("show");
}

/* ================= CERRAR MODAL ================= */
closeModal.addEventListener("click", () => {
  modal.classList.remove("show");
});

modal.addEventListener("click", e => {
  if (e.target === modal) {
    modal.classList.remove("show");
  }
});

/* ================= FILTROS ================= */
function applyFilters() {
  const searchText = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;

  const filtered = products.filter(product => {
    const matchText = product.title.toLowerCase().includes(searchText);
    const matchCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    return matchText && matchCategory;
  });

  renderProducts(filtered);
}

/* ================= EVENTOS ================= */
searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);

/* ================= INIT ================= */
getProducts();
function addToCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({
    title: modalTitle.textContent,
    price: Number(modalPrice.textContent.replace("$", "")),
    thumbnail: modalImage.src,
    category: modalCategory.textContent
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Producto agregado al carrito 🛒");
}
