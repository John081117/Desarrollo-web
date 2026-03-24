// DATOS
const PRODUCTS = [
  { id: 1, name: 'Chaqueta Lino', price: 189000, tags: ['todos', 'nuevo'], img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600', desc: 'Chaqueta elegante de lino para primavera.' },
  { id: 2, name: 'Pantalón Wide', price: 134000, tags: ['todos', 'popular'], img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600', desc: 'Pantalón amplio cómodo y moderno.' },
  { id: 3, name: 'Vestido Floral', price: 95000, tags: ['todos', 'nuevo'], img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600', desc: 'Vestido con estampado floral fresco.' },
  { id: 4, name: 'Blusa Blanca', price: 78000, tags: ['todos', 'popular'], img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600', desc: 'Blusa clásica de algodón.' },
  { id: 5, name: 'Zapatos Deportivos', price: 120000, tags: ['todos', 'nuevo'], img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600', desc: 'Zapatos cómodos para el día a día.' },
  { id: 6, name: 'Sombrero Panama', price: 65000, tags: ['todos'], img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600', desc: 'Sombrero elegante para el sol.' }
];

// COMPONENTE TARJETA
class ProductCard extends HTMLElement {
  connectedCallback() {
    const tmpl = document.getElementById('product-card-template');
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(tmpl.content.cloneNode(true));
    
    // Inyectar datos
    shadow.getElementById('name').textContent = this.getAttribute('name');
    shadow.getElementById('price').textContent = this.formatPrice(this.getAttribute('price'));
    shadow.getElementById('desc').textContent = this.getAttribute('desc');
    
    // Evento de añadir
    shadow.getElementById('btn-add').onclick = () => {
      const product = {
        id: this.getAttribute('id'),
        name: this.getAttribute('name'),
        price: parseInt(this.getAttribute('price')),
        img: this.getAttribute('img')
      };
      window.dispatchEvent(new CustomEvent('add-to-cart', { detail: product }));
    };
  }
  
  formatPrice(price) {
    return '$' + parseInt(price).toLocaleString('es-CO');
  }
}
customElements.define('product-card', ProductCard);

// GESTOR DE LA APP
const UI = {
  cart: JSON.parse(localStorage.getItem('cart')) || [],
  currentFilter: 'todos',
  init() {
    this.renderGrid();
    this.setupFilters();
    this.setupSearch();
    this.updateCartDisplay();
    window.addEventListener('add-to-cart', (e) => this.addToCart(e.detail));
  },
  renderGrid() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';
    let filteredProducts = PRODUCTS.filter(p => p.tags.includes(this.currentFilter));
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(searchTerm) || p.desc.toLowerCase().includes(searchTerm));
    }
    filteredProducts.forEach(p => {
      const card = document.createElement('product-card');
      card.setAttribute('id', p.id);
      card.setAttribute('name', p.name);
      card.setAttribute('price', p.price);
      card.setAttribute('img', p.img);
      card.setAttribute('desc', p.desc);
      grid.appendChild(card);
    });
  },
  setupFilters() {
    const bar = document.getElementById('filter-bar');
    const searchInput = document.getElementById('search-input');
    bar.insertBefore(searchInput, bar.firstChild);
    ['todos', 'nuevo', 'popular'].forEach(tag => {
      const btn = document.createElement('button');
      btn.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
      if (tag === 'todos') btn.classList.add('active');
      btn.onclick = () => {
        this.currentFilter = tag;
        this.renderGrid();
        this.updateActiveFilter(btn);
      };
      bar.appendChild(btn);
    });
  },
  setupSearch() {
    document.getElementById('search-input').addEventListener('input', () => this.renderGrid());
  },
  updateActiveFilter(activeBtn) {
    document.querySelectorAll('#filter-bar button').forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
  },
  addToCart(product) {
    const existing = this.cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
    this.saveCart();
    this.updateCartDisplay();
    this.showNotification(`${product.name} añadido al carrito`);
  },
  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  },
  updateCartDisplay() {
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-counter').textContent = `🛒 Carrito (${totalItems})`;
  },
  showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed; top: 20px; right: 20px; background: var(--accent); color: white; 
      padding: 10px 20px; border-radius: 5px; z-index: 1000; animation: fadeIn 0.5s;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }
};

UI.init();