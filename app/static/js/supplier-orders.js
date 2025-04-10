// Supplier Orders page functionality
document.addEventListener('DOMContentLoaded', function() {
  // Sample data for demonstration
  const orders = [
    {
      id: "ORD-1234",
      product: "Comic Book - Superman Vol. 1",
      quantity: 50,
      date: "2025-02-01",
      status: "processed",
      supplier: "DC Comics Distribution",
      expectedDelivery: "2025-02-10",
      hasDelay: false,
    },
    {
      id: "ORD-1235",
      product: "Action Figure - Batman",
      quantity: 25,
      date: "2025-02-02",
      status: "shipped",
      supplier: "Collectibles Inc.",
      expectedDelivery: "2025-02-12",
      hasDelay: false,
    },
    {
      id: "ORD-1236",
      product: "Comic Book - Avengers #123",
      quantity: 30,
      date: "2025-01-28",
      status: "delivered",
      supplier: "Marvel Distribution",
      expectedDelivery: "2025-02-05",
      hasDelay: false,
    },
    {
      id: "ORD-1237",
      product: "Action Figure - Spider-Man",
      quantity: 20,
      date: "2025-01-25",
      status: "shipped",
      supplier: "Collectibles Inc.",
      expectedDelivery: "2025-02-04",
      hasDelay: true,
    },
    {
      id: "ORD-1238",
      product: "Comic Book - Batman: Dark Knight",
      quantity: 40,
      date: "2025-02-03",
      status: "processed",
      supplier: "DC Comics Distribution",
      expectedDelivery: "2025-02-13",
      hasDelay: false,
    },
    {
      id: "ORD-1239",
      product: "Action Figure - Wonder Woman",
      quantity: 15,
      date: "2025-01-30",
      status: "canceled",
      supplier: "Collectibles Inc.",
      expectedDelivery: "2025-02-09",
      hasDelay: false,
    },
  ];

  // DOM elements
  const ordersTableBody = document.getElementById('ordersTableBody');
  const orderFormModal = document.getElementById('orderFormModal');
  const orderForm = document.getElementById('orderForm');
  const orderFormTitle = document.getElementById('orderFormTitle');
  const submitOrderFormBtn = document.getElementById('submitOrderForm');
  const newOrderBtn = document.getElementById('newOrderBtn');
  const closeOrderFormBtn = document.getElementById('closeOrderForm');
  const cancelOrderFormBtn = document.getElementById('cancelOrderForm');
  const delayStatusGroup = document.getElementById('delayStatusGroup');
  
  // Current active tab
  let activeTab = 'all';
  
  // Initialize the page
  function init() {
    renderOrders();
    setupEventListeners();
  }
  
  // Render orders table
  function renderOrders() {
    if (!ordersTableBody) return;
    
    // Filter orders based on active tab
    const filteredOrders = activeTab === 'all' 
      ? orders 
      : activeTab === 'delayed'
        ? orders.filter(order => order.hasDelay)
        : orders.filter(order => order.status === activeTab);
    
    // Clear table
    ordersTableBody.innerHTML = '';
    
    // Add orders to table
    filteredOrders.forEach(order => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${order.id}</td>
        <td>${order.product}</td>
        <td>${order.quantity}</td>
        <td>${order.date}</td>
        <td>
          <div class="status-indicator">
            <span class="status-dot status-${order.status}"></span>
            <span class="status-text">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
            ${order.hasDelay ? '<span class="badge badge-red">Delayed</span>' : ''}
          </div>
        </td>
        <td>${order.expectedDelivery}</td>
        <td>${order.supplier}</td>
      `;
      
      // Add click event to open order details
      row.addEventListener('click', () => openOrderForm(order));
      
      ordersTableBody.appendChild(row);
    });
    
    // Add status dot styles if not already in the document
    if (!document.querySelector('#status-styles')) {
      const style = document.createElement('style');
      style.id = 'status-styles';
      style.textContent = `
        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .status-dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
        }
        
        .status-processed {
          background-color: #3b82f6;
        }
        
        .status-shipped {
          background-color: #f59e0b;
        }
        
        .status-delivered {
          background-color: #10b981;
        }
        
        .status-canceled {
          background-color: #ef4444;
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  // Setup event listeners
  function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-item').forEach(tab => {
      tab.addEventListener('click', function() {
        activeTab = this.getAttribute('data-tab');
        renderOrders();
      });
    });
    
    // New order button
    if (newOrderBtn) {
      newOrderBtn.addEventListener('click', () => openOrderForm());
    }
    
    // Close order form buttons
    if (closeOrderFormBtn) {
      closeOrderFormBtn.addEventListener('click', closeOrderForm);
    }
    
    if (cancelOrderFormBtn) {
      cancelOrderFormBtn.addEventListener('click', closeOrderForm);
    }
    
    // Form submission
    if (orderForm) {
      orderForm.addEventListener('submit', handleOrderFormSubmit);
    }
  }
  
  // Open order form (edit or create)
  function openOrderForm(order = null) {
    if (!orderFormModal) return;
    
    const isEditMode = !!order;
    
    // Set form title
    if (orderFormTitle) {
      orderFormTitle.textContent = isEditMode ? `Edit Order ${order.id}` : 'Create New Order';
    }
    
    // Set submit button text
    if (submitOrderFormBtn) {
      submitOrderFormBtn.textContent = isEditMode ? 'Update Order' : 'Create Order';
    }
    
    // Show/hide delay status field
    if (delayStatusGroup) {
      delayStatusGroup.style.display = isEditMode ? 'block' : 'none';
    }
    
    // Fill form with order data if editing
    if (isEditMode) {
      document.getElementById('orderId').value = order.id;
      document.getElementById('product').value = order.product;
      document.getElementById('quantity').value = order.quantity;
      document.getElementById('date').value = order.date;
      document.getElementById('expectedDelivery').value = order.expectedDelivery;
      document.getElementById('supplier').value = order.supplier;
      document.getElementById('status').value = order.status;
      document.getElementById('notes').value = order.notes || '';
      
      if (document.getElementById('hasDelay')) {
        document.getElementById('hasDelay').value = order.hasDelay ? 'yes' : 'no';
      }
    } else {
      // Reset form for new order
      orderForm.reset();
      document.getElementById('orderId').value = '';
      
      // Set default dates
      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const nextWeekStr = nextWeek.toISOString().split('T')[0];
      
      document.getElementById('date').value = today;
      document.getElementById('expectedDelivery').value = nextWeekStr;
    }
    
    // Show modal
    orderFormModal.classList.add('active');
  }
  
  // Close order form
  function closeOrderForm() {
    if (!orderFormModal) return;
    orderFormModal.classList.remove('active');
  }
  
  // Handle order form submission
  function handleOrderFormSubmit(e) {
    e.preventDefault();
    
    const orderId = document.getElementById('orderId').value;
    const isEditMode = !!orderId;
    
    // Get form data
    const formData = {
      product: document.getElementById('product').value,
      quantity: parseInt(document.getElementById('quantity').value),
      date: document.getElementById('date').value,
      expectedDelivery: document.getElementById('expectedDelivery').value,
      supplier: document.getElementById('supplier').value,
      status: document.getElementById('status').value,
      notes: document.getElementById('notes').value,
      hasDelay: isEditMode && document.getElementById('hasDelay').value === 'yes'
    };
    
    if (isEditMode) {
      // Update existing order
      const orderIndex = orders.findIndex(order => order.id === orderId);
      if (orderIndex !== -1) {
        orders[orderIndex] = { ...orders[orderIndex], ...formData };
        window.showToast('Success', `Order ${orderId} has been updated.`, 'success');
      }
    } else {
      // Create new order
      const newOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        ...formData
      };
      orders.unshift(newOrder);
      window.showToast('Success', `Order ${newOrder.id} has been created.`, 'success');
    }
    
    // Close form and refresh table
    closeOrderForm();
    renderOrders();
  }
  
  // Initialize the page
  init();
});

