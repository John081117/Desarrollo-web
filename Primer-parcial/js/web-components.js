/**
 * web-components.js - Define Web Components personalizados
 * Utiliza Shadow DOM para encapsular estilos y estructura
 */

/**
 * ProductCard - Web Component para tarjetas de producto
 * Encapsula estilos y HTML usando Shadow DOM
 */
class ProductCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  /**
   * Renderiza el contenido del componente
   */
  render() {
    const name = this.getAttribute('name') || 'Producto';
    const price = this.getAttribute('price') || '$0.00';
    const description = this.getAttribute('description') || 'Sin descripción';
    const image = this.getAttribute('image') || '📦';

    const template = `
      <style>
        :host {
          display: block;
        }

        .product-card {
          background: #122215;
          border: 2px solid #1f4f36;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 255, 118, 0.35);
          border-color: #60d86b;
        }

        .product-image {
          width: 100%;
          height: 200px;
          background: #0f3f2b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          color: #d0ffc2;
          overflow: hidden;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .product-info {
          padding: 1.5rem;
        }

        .product-name {
          font-size: 1.1rem;
          font-weight: bold;
          color: #baff95;
          margin-bottom: 0.5rem;
        }

        .product-price {
          color: #70f2a7;
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .product-description {
          color: #d5e5c1;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .product-button {
          width: 100%;
          padding: 0.75rem;
          background-color: #198a4d;
          color: #e6ffe9;
          border: 1px solid #3bf5a7;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s, box-shadow 0.2s;
        }

        .product-button:hover {
          background-color: #3bf5a7;
          box-shadow: 0 0 8px rgba(59, 245, 167, 0.6);
        }

        .product-button:active {
          transform: scale(0.98);
        }
      </style>

      <div class="product-card">
        <div class="product-image"><img src="${image}" alt="${name}"></div>
        <div class="product-info">
          <div class="product-name">${name}</div>
          <div class="product-price">${price}</div>
          <div class="product-description">${description}</div>
          <button class="product-button">Agregar al carrito</button>
        </div>
      </div>
    `;

    this.shadowRoot.innerHTML = template;

    // Agregar evento al botón
    const button = this.shadowRoot.querySelector('.product-button');
    button.addEventListener('click', () => this.handleAddToCart());
  }

  /**
   * Maneja el evento de agregar al carrito
   */
  handleAddToCart() {
    const productId = this.getAttribute('product-id');
    const productName = this.getAttribute('name');

    // Emite evento para la aplicación principal
    this.dispatchEvent(new CustomEvent('add-to-cart', {
      bubbles: true,
      composed: true,
      detail: { id: productId, name: productName }
    }));

    console.log(`Producto agregado desde Web Component: ${productName}`);
  }
}

// Registrar el Web Component
customElements.define('product-card', ProductCard);
