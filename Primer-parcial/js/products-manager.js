/**
 * products-manager.js - Gestiona la carga y renderización de productos
 * Carga datos desde JSON y los renderiza usando Template HTML y Web Components
 */

// Variable global para almacenar productos
let productsData = [];

// Carrito global y persistencia localStorage
let cartData = JSON.parse(localStorage.getItem('soccerCart') || '[]');

/**
 * Guarda el carrito en localStorage
 */
function saveCart() {
  localStorage.setItem('soccerCart', JSON.stringify(cartData));
}

/**
 * Agrega un producto al carrito
 * @param {number} productId
 */
function addToCart(productId) {
  const product = productsData.find(p => p.id === Number(productId));
  if (!product) return;

  const cartItem = cartData.find(item => item.id === product.id);

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cartData.push({ id: product.id, name: product.name, price: product.price, quantity: 1, priceValue: Number(product.price.replace(/[^0-9\.]+/g, '')) });
  }
  saveCart();
  renderCart();
  alert(`✅ "${product.name}" agregado al carrito`);
  console.log(`Producto agregado: ${product.name}`);
}

/**
 * Renderiza el carrito en el panel
 */
function renderCart() {
  const cartPanel = document.getElementById('cart-panel');
  if (!cartPanel) return;

  if (cartData.length === 0) {
    cartPanel.innerHTML = '<div class="cart-panel"><h4>Tu carrito está vacío</h4><p class="cart-empty">Agrega productos para verlos aquí.</p></div>';
    return;
  }

  const total = cartData.reduce((acc, item) => acc + item.priceValue * item.quantity, 0);

  const itemsHTML = cartData.map(item => `
    <div class="cart-item">
      <div>
        <button class="cart-decrement" data-product-id="${item.id}">−</button>
        <span>${item.quantity}</span>
        <button class="cart-increment" data-product-id="${item.id}">+</button>
      </div>
      <span>${item.name}</span>
      <span>$${(item.priceValue * item.quantity).toFixed(2)}</span>
      <button class="cart-remove" data-product-id="${item.id}">Eliminar</button>
    </div>
  `).join('');

  cartPanel.innerHTML = `
    <div class="cart-panel">
      <h4>Carrito</h4>
      ${itemsHTML}
      <div class="cart-total">Total: $${total.toFixed(2)}</div>
    </div>
  `;
}

/**
 * Carga los productos desde el archivo JSON
 * @returns {Promise<Array>} - Array de productos cargados
 */
async function loadProducts() {
  try {
    const response = await fetch('./data/products.json');
    
    if (!response.ok) {
      throw new Error(`Error cargando productos: ${response.status}`);
    }
    
    productsData = await response.json();
    console.log(`${productsData.length} productos cargados exitosamente`);
    return productsData;
  } catch (error) {
    console.error('Error cargando productos:', error);
    return [];
  }
}

/**
 * Renderiza productos usando plantilla HTML
 * @param {Array} products - Array de productos a renderizar
 * @param {string} containerId - ID del contenedor donde renderizar
 */
function renderProductsWithTemplate(products, containerId) {
  const container = document.getElementById(containerId);
  
  if (!container) {
    console.error(`Contenedor con ID '${containerId}' no encontrado`);
    return;
  }
  
  const template = document.getElementById('product-template');
  
  if (!template) {
    console.error('Plantilla de producto no encontrada');
    return;
  }
  
  // Limpiar contenedor
  container.innerHTML = '';
  
  // Crear y agregar producto para cada item
  products.forEach(product => {
    const clone = template.content.cloneNode(true);
    
    clone.querySelector('.product-name').textContent = product.name;
    clone.querySelector('.product-price').textContent = product.price;
    clone.querySelector('.product-description').textContent = product.description;
    const img = clone.querySelector('.product-image img');
    img.src = product.image;
    img.alt = product.name;
    clone.querySelector('.product-button').setAttribute('data-product-id', product.id);
    
    container.appendChild(clone);
  });
  
  console.log(`${products.length} productos renderizados con Template`);
}

/**
 * Renderiza productos usando Web Components
 * @param {Array} products - Array de productos a renderizar
 * @param {string} containerId - ID del contenedor donde renderizar
 */
function renderProductsWithWebComponents(products, containerId) {
  const container = document.getElementById(containerId);
  
  if (!container) {
    console.error(`Contenedor con ID '${containerId}' no encontrado`);
    return;
  }
  
  // Limpiar contenedor
  container.innerHTML = '';
  
  // Crear web component para cada producto
  products.forEach(product => {
    const productCard = document.createElement('product-card');
    productCard.setAttribute('product-id', product.id);
    productCard.setAttribute('name', product.name);
    productCard.setAttribute('price', product.price);
    productCard.setAttribute('description', product.description);
    productCard.setAttribute('image', product.image);
    
    container.appendChild(productCard);
  });
  
  console.log(`${products.length} productos renderizados con Web Components`);
}

/**
 * Filtra productos por categoría
 * @param {string} category - Categoría para filtrar
 * @returns {Array} - Productos filtrados
 */
function removeFromCart(productId) {
  const id = Number(productId);
  const index = cartData.findIndex(item => item.id === id);
  if (index !== -1) {
    cartData.splice(index, 1);
    saveCart();
    renderCart();
  }
}

function decrementCartItem(productId) {
  const id = Number(productId);
  const item = cartData.find(item => item.id === id);

  if (!item) return;

  item.quantity -= 1;
  if (item.quantity <= 0) {
    removeFromCart(id);
  } else {
    saveCart();
    renderCart();
  }
}

function filterProductsByCategory(category) {
  if (category === 'all' || !category) {
    return productsData;
  }
  
  return productsData.filter(product => product.category === category);
}
