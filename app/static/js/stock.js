// Stock management page functionality
document.addEventListener('DOMContentLoaded', function() {
  // Sample product data
  const products = [
    { id: 1, name: "Batman: The Dark Knight Returns", price: 19.99, stock: 50, lowStockThreshold: 10 },
    { id: 2, name: "Spider-Man: Miles Morales Vol. 1", price: 14.99, stock: 8, lowStockThreshold: 10 },
    { id: 3, name: "Wonder Woman Figurine", price: 49.99, stock: 15, lowStockThreshold: 5 },
    { id: 4, name: "X-Men: Dark Phoenix Saga", price: 24.99, stock: 3, lowStockThreshold: 5 },
    { id: 5, name: "Iron Man Mark 42 Helmet", price: 99.99, stock: 10, lowStockThreshold: 3 },
  ];

  // DOM elements
  const stockTableBody = document.getElementById('stockTableBody');
  const lowStockTableBody = document.getElementById('lowStockTableBody');
  const lowStockCount = document.getElementById('lowStockCount');
  const lowStockModal = document.getElementById('lowStockModal');
  const lowStockBtn = document.getElementById('lowStockBtn');
  const closeLowStockModal = document.getElementById('closeLowStockModal');
  const searchProducts = document.getElementById('searchProducts');
  const generateReportBtn = document.getElementById('generateReportBtn');
  
  // Current editing product ID
  let editingId = null;
  
  // Initialize the page
  function init() {
    renderStockTable();
    updateLowStockCount();
    setupEventListeners();
    checkLowStockItems();
  }
  
  // Render stock table
  function renderStockTable(searchTerm = '') {
    if (!stockTableBody) return;
    
    // Filter products based on search term
    const filteredProducts = searchTerm 
      ? products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
      : products;
    
    // Clear table
    stockTableBody.innerHTML = '';
    
    // Add products to table
    filteredProducts.forEach(product => {
      const row = document.createElement('tr');
      
      if (editingId === product.id) {
        // Editing mode
        row.innerHTML = `
          <td>${product.name}</td>
          <td>$${product.price.toFixed(2)}</td>
          <td>
            <input type="number" class="input stock-input" value="${product.stock}" min="0">
          </td>
          <td>${product.lowStockThreshold}</td>
          <td>
            <button class="btn btn-primary btn-sm save-stock" data-id="${product.id}">
              <i class="fa-solid fa-save"></i> Save
            </button>
          </td>
        `;
      } else {
        // View mode
        row.innerHTML = `
          <td>${product.name}</td>
          <td>$${product.price.toFixed(2)}</td>
          <td class="${product.stock <= product.lowStockThreshold ? 'low-stock' : ''}">${product.stock} ${product.stock <= product.lowStockThreshold ? '<i class="fa-solid fa-exclamation-triangle warning-icon"></i>' : ''}</td>
          <td>${product.lowStockThreshold}</td>
          <td>
            <button class="btn btn-outline btn-sm edit-stock" data-id="${product.id}">
              <i class="fa-solid fa-edit"></i> Edit
            </button>
          </td>
        `;
      }
      
      stockTableBody.appendChild(row);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.edit-stock').forEach(button => {
      button.addEventListener('click', function() {
        const productId = parseInt(this.getAttribute('data-id'));
        editingId = productId;
        renderStockTable(searchTerm);
      });
    });
    
    document.querySelectorAll('.save-stock').forEach(button => {
      button.addEventListener('click', function() {
        const productId = parseInt(this.getAttribute('data-id'));
        const stockInput = this.closest('tr').querySelector('.stock-input');
        const newStock = parseInt(stockInput.value);
        
        updateProductStock(productId, newStock);
        editingId = null;
        renderStockTable(searchTerm);
      });
    });
    
    // Add low stock styles if not already in the document
    if (!document.querySelector('#low-stock-styles')) {
      const style = document.createElement('style');
      style.id = 'low-stock-styles';
      style.textContent = `
        .low-stock {
          color: var(--destructive);
          font-weight: 700;
        }
        
        .warning-icon {
          color: var(--chart-4);
          margin-left: 0.5rem;
        }
        
        .btn-sm {
          height: 2rem;
          padding: 0 0.75rem;
          font-size: 0.75rem;
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  // Update product stock
  function updateProductStock(productId, newStock) {
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) return;
    
    const oldStock = products[productIndex].stock;
    products[productIndex].stock = newStock;
    
    // Check if stock is low
    checkLowStock(products[productIndex]);
    
    // Update low stock count
    updateLowStockCount();
    
    // Show toast notification
    window.showToast('Stock Updated', `Stock for ${products[productIndex].name} updated from ${oldStock} to ${newStock}.`, 'success');
  }
  
  // Check if product has low stock
  function checkLowStock(product) {
    if (product.stock <= product.lowStockThreshold) {
      window.showToast('Low Stock Alert', `${product.name} is running low on stock (${product.stock} remaining).`, 'warning');
    }
  }
  
  // Check all products for low stock
  function checkLowStockItems() {
    const lowStockItems = products.filter(product => product.stock <= product.lowStockThreshold);
    
    lowStockItems.forEach(product => {
      checkLowStock(product);
    });
  }
  
  // Update low stock count
  function updateLowStockCount() {
    if (!lowStockCount) return;
    
    const lowStockItems = products.filter(product => product.stock <= product.lowStockThreshold);
    lowStockCount.textContent = lowStockItems.length;
    
    // Render low stock table
    renderLowStockTable(lowStockItems);
  }
  
  // Render low stock table
  function renderLowStockTable(lowStockItems) {
    if (!lowStockTableBody) return;
    
    // Clear table
    lowStockTableBody.innerHTML = '';
    
    // Add low stock items to table
    lowStockItems.forEach(product => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${product.name}</td>
        <td>${product.stock}</td>
        <td>${product.lowStockThreshold}</td>
      `;
      
      lowStockTableBody.appendChild(row);
    });
  }
  
  // Setup event listeners
  function setupEventListeners() {
    // Search products
    if (searchProducts) {
      searchProducts.addEventListener('input', function() {
        renderStockTable(this.value);
      });
    }
    
    // Low stock button
    if (lowStockBtn && lowStockModal) {
      lowStockBtn.addEventListener('click', function() {
        lowStockModal.classList.add('active');
      });
    }
    
    // Close low stock modal
    if (closeLowStockModal && lowStockModal) {
      closeLowStockModal.addEventListener('click', function() {
        lowStockModal.classList.remove('active');
      });
    }
    
    // Generate report button
    if (generateReportBtn) {
      generateReportBtn.addEventListener('click', generateStockReport);
    }
  }
  
  // Generate stock report
  function generateStockReport() {
    // Create CSV content
    let csvContent = 'Product Name,Price,Current Stock,Low Stock Threshold\n';
    
    products.forEach(product => {
      csvContent += `"${product.name}",${product.price},${product.stock},${product.lowStockThreshold}\n`;
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'stock_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show toast notification
    window.showToast('Report Generated', 'Stock report has been downloaded.', 'success');
  }
  
  // Initialize the page
  init();
});

