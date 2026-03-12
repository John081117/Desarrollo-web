// DATOS
const PRODUCTS = [
  { id: 1, name: 'Chaqueta Lino', price: '$189.000', tags: ['todos', 'nuevo'], img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600' },
  { id: 2, name: 'Pantalón Wide', price: '$134.000', tags: ['todos', 'popular'], img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600' }
];

// COMPONENTE TARJETA
class ProductCard extends HTMLElement {
  connectedCallback() {
    const tmpl = document.getElementById('product-card-template');
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(tmpl.content.cloneNode(true));
    
    // Inyectar datos
    shadow.getElementById('name').textContent = this.getAttribute('name');
    shadow.getElementById('price').textContent = this.getAttribute('price');
    shadow.getElementById('img').src = this.getAttribute('img');
    
    // Evento de añadir
    shadow.getElementById('btn-add').onclick = () => {
      window.dispatchEvent(new CustomEvent('update-cart'));
    };
  }
}
customElements.define('product-card', ProductCard);

// GESTOR DE LA APP
const UI = {
  cartCount: 0,
  init() {
    this.renderGrid('todos');
    this.setupFilters();
    window.addEventListener('update-cart', () => this.incrementCart());
  },
  renderGrid(filter) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';
    PRODUCTS.filter(p => p.tags.includes(filter)).forEach(p => {
      const card = document.createElement('product-card');
      card.setAttribute('name', p.name);
      card.setAttribute('price', p.price);
      card.setAttribute('img', p.img);
      grid.appendChild(card);
    });
  },
  setupFilters() {
    const bar = document.getElementById('filter-bar');
    ['todos', 'nuevo', 'popular'].forEach(tag => {
      const btn = document.createElement('button');
      btn.textContent = tag.toUpperCase();
      btn.onclick = () => this.renderGrid(tag);
      bar.appendChild(btn);
    });
  },
  incrementCart() {
    this.cartCount++;
    document.getElementById('cart-counter').textContent = `🛒 Carrito (${this.cartCount})`;
  }
};

UI.init();