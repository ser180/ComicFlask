// Store page functionality
document.addEventListener('DOMContentLoaded', function() {
  // Sample product data
  const products = [
    {
      id: "1",
      name: "Batman: The Dark Knight Returns",
      price: 19.99,
      image: "img/placeholder-product.jpg",
      description: "Frank Miller's groundbreaking Batman story.",
    },
    {
      id: "2",
      name: "Spider-Man: Miles Morales Vol. 1",
      price: 14.99,
      image: "img/placeholder-product.jpg",
      description: "The beginning of Miles Morales' journey as Spider-Man.",
    },
    {
      id: "3",
      name: "Wonder Woman Figurine",
      price: 49.99,
      image: "img/placeholder-product.jpg",
      description: "Highly detailed Wonder Woman collectible figurine.",
    },
    {
      id: "4",
      name: "X-Men: Dark Phoenix Saga",
      price: 24.99,
      image: "img/placeholder-product.jpg",
      description: "The classic X-Men storyline in a deluxe edition.",
    },
    {
      id: "5",
      name: "Iron Man Mark 42 Helmet",
      price: 99.99,
      image: "img/placeholder-product.jpg",
      description: "Replica of Tony Stark's Iron Man helmet.",
    },
    {
      id: "6",
      name: "Watchmen",
      price: 29.99,
      image: "img/placeholder-product.jpg",
      description: "Alan Moore's seminal graphic novel.",
    },
  ];

  // Cart functionality
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // DOM elements
  const productGrid = document.getElementById('productGrid');
  const cartCount = document.getElementById('cartCount');
  
  // Initialize the page
  function init() {
    renderProducts();
    updateCartCount();
  }
  
  // Render products
  function renderProducts() {
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    
    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-content">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <p class="product-price">$${product.price.toFixed(2)}</p>
        </div>
        <div class="product-actions">
          <a href="product.html?id=${product.id}" class="btn btn-primary">View Details</a>
          <button class="btn btn-outline add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>
      `;
      
      productGrid.appendChild(productCard);
    });
    
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        addToCart(productId);
      });
    });
  }
  
  // Add product to cart
  function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show toast notification
    window.showToast('Added to Cart', `${product.name} has been added to your cart.`, 'success');
  }
  
  // Update cart count
  function updateCartCount() {
    if (!cartCount) return;
    
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
  }
  
  // Initialize the page
  init();
});

