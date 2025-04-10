// Customers page functionality
document.addEventListener('DOMContentLoaded', function() {
  // Sample data for demonstration
  const customers = [
    {
      id: "CUST-1001",
      name: "Juan Pérez",
      email: "juan.perez@example.com",
      phone: "+52 442 123 4567",
      address: "Av. Constituyentes 123, Querétaro",
      registrationDate: "2024-01-15",
      totalPurchases: 12,
      totalSpent: 4850,
      isFrequent: true,
      lastPurchase: "2025-01-28",
      avatar: "img/placeholder-avatar.png",
    },
    {
      id: "CUST-1002",
      name: "María González",
      email: "maria.gonzalez@example.com",
      phone: "+52 442 234 5678",
      address: "Calle Hidalgo 456, Querétaro",
      registrationDate: "2024-02-03",
      totalPurchases: 3,
      totalSpent: 1200,
      isFrequent: false,
      lastPurchase: "2025-01-20",
      avatar: "img/placeholder-avatar.png",
    },
    {
      id: "CUST-1003",
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@example.com",
      phone: "+52 442 345 6789",
      address: "Blvd. Bernardo Quintana 789, Querétaro",
      registrationDate: "2023-11-10",
      totalPurchases: 8,
      totalSpent: 3200,
      isFrequent: true,
      lastPurchase: "2025-01-25",
      avatar: "img/placeholder-avatar.png",
    },
    {
      id: "CUST-1004",
      name: "Ana Martínez",
      email: "ana.martinez@example.com",
      phone: "+52 442 456 7890",
      address: "Av. Universidad 321, Querétaro",
      registrationDate: "2024-01-05",
      totalPurchases: 5,
      totalSpent: 1850,
      isFrequent: false,
      lastPurchase: "2025-01-15",
      avatar: "img/placeholder-avatar.png",
    },
    {
      id: "CUST-1005",
      name: "Roberto Sánchez",
      email: "roberto.sanchez@example.com",
      phone: "+52 442 567 8901",
      address: "Calle Corregidora 654, Querétaro",
      registrationDate: "2023-10-20",
      totalPurchases: 15,
      totalSpent: 6300,
      isFrequent: true,
      lastPurchase: "2025-02-01",
      avatar: "img/placeholder-avatar.png",
    },
    {
      id: "CUST-1006",
      name: "Laura Torres",
      email: "laura.torres@example.com",
      phone: "+52 442 678 9012",
      address: "Av. 5 de Febrero 987, Querétaro",
      registrationDate: "2024-01-25",
      totalPurchases: 2,
      totalSpent: 750,
      isFrequent: false,
      lastPurchase: "2025-01-30",
      avatar: "img/placeholder-avatar.png",
    },
  ];

  // Sample purchase history data
  const purchaseHistory = {
    "CUST-1001": [
      { id: "ORD-5001", date: "2025-01-28", items: 3, total: 450, status: "delivered" },
      { id: "ORD-4832", date: "2025-01-15", items: 2, total: 320, status: "delivered" },
      { id: "ORD-4567", date: "2024-12-30", items: 1, total: 180, status: "delivered" },
      { id: "ORD-4302", date: "2024-12-12", items: 4, total: 560, status: "delivered" },
      { id: "ORD-3985", date: "2024-11-25", items: 2, total: 340, status: "delivered" },
    ],
    "CUST-1003": [
      { id: "ORD-4998", date: "2025-01-25", items: 2, total: 280, status: "delivered" },
      { id: "ORD-4756", date: "2025-01-10", items: 1, total: 150, status: "delivered" },
      { id: "ORD-4489", date: "2024-12-22", items: 3, total: 420, status: "delivered" },
      { id: "ORD-4201", date: "2024-12-05", items: 2, total: 350, status: "delivered" },
    ],
    "CUST-1005": [
      { id: "ORD-5012", date: "2025-02-01", items: 3, total: 480, status: "delivered" },
      { id: "ORD-4876", date: "2025-01-18", items: 2, total: 320, status: "delivered" },
      { id: "ORD-4654", date: "2025-01-02", items: 4, total: 590, status: "delivered" },
      { id: "ORD-4432", date: "2024-12-15", items: 1, total: 160, status: "delivered" },
      { id: "ORD-4210", date: "2024-11-30", items: 2, total: 340, status: "delivered" },
      { id: "ORD-3987", date: "2024-11-12", items: 3, total: 450, status: "delivered" },
    ],
  };

  // DOM elements
  const customersTableBody = document.getElementById('customersTableBody');
  const customerFormModal = document.getElementById('customerFormModal');
  const customerForm = document.getElementById('customerForm');
  const customerFormTitle = document.getElementById('customerFormTitle');
  const submitCustomerFormBtn = document.getElementById('submitCustomerForm');
  const newCustomerBtn = document.getElementById('newCustomerBtn');
  const closeCustomerFormBtn = document.getElementById('closeCustomerForm');
  const cancelCustomerFormBtn = document.getElementById('cancelCustomerForm');
  const customerDetail = document.getElementById('customerDetail');
  const customerContent = document.getElementById('customerContent');
  const backToCustomersBtn = document.getElementById('backToCustomers');
  const editCustomerBtn = document.getElementById('editCustomer');
  const customerStatsGroup = document.getElementById('customerStatsGroup');
  
  // Current active tab and selected customer
  let activeTab = 'all';
  let selectedCustomer = null;
  
  // Initialize the page
  function init() {
    renderCustomers();
    setupEventListeners();
  }
  
  // Render customers table
  function renderCustomers() {
    if (!customersTableBody) return;
    
    // Filter customers based on active tab
    const filteredCustomers = activeTab === 'all' 
      ? customers 
      : activeTab === 'frequent'
        ? customers.filter(customer => customer.isFrequent)
        : customers.filter(customer => !customer.isFrequent);
    
    // Clear table
    customersTableBody.innerHTML = '';
    
    // Add customers to table
    filteredCustomers.forEach(customer => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>
          <img src="${customer.avatar}" alt="${customer.name}" class="avatar-small">
        </td>
        <td>
          <div class="customer-name">${customer.name}</div>
          <div class="customer-id">${customer.id}</div>
        </td>
        <td>
          <div>${customer.email}</div>
          <div class="text-muted">${customer.phone}</div>
        </td>
        <td>${customer.registrationDate}</td>
        <td>${customer.totalPurchases}</td>
        <td>$${customer.totalSpent.toLocaleString()}</td>
        <td>${customer.lastPurchase}</td>
        <td>
          ${customer.isFrequent 
            ? `<span class="badge badge-amber"><i class="fa-solid fa-star"></i> Frequent</span>` 
            : `<span class="badge badge-outline">Regular</span>`}
        </td>
      `;
      
      // Add click event to open customer details
      row.addEventListener('click', () => openCustomerDetail(customer));
      
      customersTableBody.appendChild(row);
    });
    
    // Add avatar styles if not already in the document
    if (!document.querySelector('#avatar-styles')) {
      const style = document.createElement('style');
      style.id = 'avatar-styles';
      style.textContent = `
        .avatar-small {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .customer-name {
          font-weight: 500;
        }
        
        .customer-id {
          font-size: 0.75rem;
          color: var(--muted-foreground);
        }
        
        .text-muted {
          font-size: 0.75rem;
          color: var(--muted-foreground);
        }
        
        .badge-outline {
          background-color: transparent;
          border: 1px solid var(--border);
          color: var(--foreground);
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
        renderCustomers();
      });
    });
    
    // New customer button
    if (newCustomerBtn) {
      newCustomerBtn.addEventListener('click', () => openCustomerForm());
    }
    
    // Close customer form buttons
    if (closeCustomerFormBtn) {
      closeCustomerFormBtn.addEventListener('click', closeCustomerForm);
    }
    
    if (cancelCustomerFormBtn) {
      cancelCustomerFormBtn.addEventListener('click', closeCustomerForm);
    }
    
    // Form submission
    if (customerForm) {
      customerForm.addEventListener('submit', handleCustomerFormSubmit);
    }
    
    // Back to customers button
    if (backToCustomersBtn) {
      backToCustomersBtn.addEventListener('click', closeCustomerDetail);
    }
    
    // Edit customer button
    if (editCustomerBtn) {
      editCustomerBtn.addEventListener('click', () => {
        if (selectedCustomer) {
          openCustomerForm(selectedCustomer);
        }
      });
    }
    
    // Detail tabs
    document.querySelectorAll('#customerDetail .tab-item').forEach(tab => {
      tab.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        
        // Remove active class from all tabs and content
        document.querySelectorAll('#customerDetail .tab-item').forEach(item => {
          item.classList.remove('active');
        });
        
        document.querySelectorAll('#customerDetail .tab-content').forEach(content => {
          content.classList.remove('active');
        });
        
        // Add active class to clicked tab and corresponding content
        this.classList.add('active');
        const tabContent = document.getElementById(`tab-${tabId}`);
        if (tabContent) {
          tabContent.classList.add('active');
        }
      });
    });
  }
  
  // Open customer form (edit or create)
  function openCustomerForm(customer = null) {
    if (!customerFormModal) return;
    
    const isEditMode = !!customer;
    
    // Set form title
    if (customerFormTitle) {
      customerFormTitle.textContent = isEditMode ? `Edit Customer ${customer.id}` : 'Register New Customer';
    }
    
    // Set submit button text
    if (submitCustomerFormBtn) {
      submitCustomerFormBtn.textContent = isEditMode ? 'Update Customer' : 'Register Customer';
    }
    
    // Show/hide customer stats fields
    if (customerStatsGroup) {
      customerStatsGroup.style.display = isEditMode ? 'block' : 'none';
    }
    
    // Fill form with customer data if editing
    if (isEditMode) {
      document.getElementById('customerId').value = customer.id;
      document.getElementById('name').value = customer.name;
      document.getElementById('email').value = customer.email;
      document.getElementById('phone').value = customer.phone;
      document.getElementById('address').value = customer.address;
      document.getElementById('registrationDate').value = customer.registrationDate;
      document.getElementById('notes').value = customer.notes || '';
      
      if (document.getElementById('totalPurchases')) {
        document.getElementById('totalPurchases').value = customer.totalPurchases;
      }
      
      if (document.getElementById('totalSpent')) {
        document.getElementById('totalSpent').value = customer.totalSpent;
      }
      
      if (document.getElementById('lastPurchase')) {
        document.getElementById('lastPurchase').value = customer.lastPurchase;
      }
      
      if (document.getElementById('isFrequent')) {
        document.getElementById('isFrequent').checked = customer.isFrequent;
      }
    } else {
      // Reset form for new customer
      customerForm.reset();
      document.getElementById('customerId').value = '';
      
      // Set default registration date to today
      const today = new Date().toISOString().split('T')[0];
      document.getElementById('registrationDate').value = today;
    }
    
    // Hide customer detail if open
    if (customerDetail) {
      customerDetail.style.display = 'none';
    }
    
    // Show customer content if hidden
    if (customerContent) {
      customerContent.style.display = 'block';
    }
    
    // Show modal
    customerFormModal.classList.add('active');
  }
  
  // Close customer form
  function closeCustomerForm() {
    if (!customerFormModal) return;
    customerFormModal.classList.remove('active');
    
    // Show customer detail if a customer is selected
    if (selectedCustomer && customerDetail) {
      customerDetail.style.display = 'block';
    }
  }
  
  // Open customer detail view
  function openCustomerDetail(customer) {
    if (!customerDetail) return;
    
    selectedCustomer = customer;
    
    // Hide customer content
    if (customerContent) {
      customerContent.style.display = 'none';
    }
    
    // Update customer detail view with customer data
    document.getElementById('customerName').textContent = customer.name;
    document.getElementById('customerIdDisplay').textContent = customer.id;
    document.getElementById('customerEmail').textContent = customer.email;
    document.getElementById('customerPhone').textContent = customer.phone;
    document.getElementById('customerAddress').textContent = customer.address;
    document.getElementById('customerRegDate').textContent = customer.registrationDate;
    document.getElementById('customerAvatar').src = customer.avatar;
    
    // Update stats
    document.getElementById('statTotalPurchases').textContent = customer.totalPurchases;
    document.getElementById('statPurchaseType').textContent = customer.isFrequent ? 'Frequent customer' : 'Regular customer';
    document.getElementById('statTotalSpent').textContent = `$${customer.totalSpent.toLocaleString()}`;
    document.getElementById('statLastPurchase').textContent = customer.lastPurchase;
    
    // Check if customer is active (purchased in the last 30 days)
    const lastPurchaseDate = new Date(customer.lastPurchase);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    document.getElementById('statActivity').textContent = lastPurchaseDate > thirtyDaysAgo ? 'Recent activity' : 'Inactive';
    
    // Show/hide frequent customer badge
    const frequentBadge = document.getElementById('frequentBadge');
    const customerBadge = document.getElementById('customerBadge');
    
    if (frequentBadge) {
      frequentBadge.style.display = customer.isFrequent ? 'inline-flex' : 'none';
    }
    
    if (customerBadge) {
      customerBadge.style.display = customer.isFrequent ? 'flex' : 'none';
    }
    
    // Render purchase history
    const purchaseHistoryTableBody = document.getElementById('purchaseHistoryTableBody');
    const noPurchaseHistory = document.getElementById('noPurchaseHistory');
    
    if (purchaseHistoryTableBody) {
      purchaseHistoryTableBody.innerHTML = '';
      
      const history = purchaseHistory[customer.id] || [];
      
      if (history.length > 0) {
        history.forEach(purchase => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${purchase.id}</td>
            <td>${purchase.date}</td>
            <td>${purchase.items}</td>
            <td>$${purchase.total.toLocaleString()}</td>
            <td><span class="badge badge-${purchase.status === 'delivered' ? 'green' : 'blue'}">${purchase.status}</span></td>
          `;
          purchaseHistoryTableBody.appendChild(row);
        });
        
        if (noPurchaseHistory) {
          noPurchaseHistory.style.display = 'none';
        }
      } else {
        if (noPurchaseHistory) {
          noPurchaseHistory.style.display = 'flex';
        }
      }
    }
    
    // Show customer detail
    customerDetail.style.display = 'block';
  }
  
  // Close customer detail view
  function closeCustomerDetail() {
    if (!customerDetail) return;
    
    customerDetail.style.display = 'none';
    selectedCustomer = null;
    
    // Show customer content
    if (customerContent) {
      customerContent.style.display = 'block';
    }
  }
  
  // Handle customer form submission
  function handleCustomerFormSubmit(e) {
    e.preventDefault();
    
    const customerId = document.getElementById('customerId').value;
    const isEditMode = !!customerId;
    
    // Get form data
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value,
      registrationDate: document.getElementById('registrationDate').value,
      notes: document.getElementById('notes').value,
    };
    
    if (isEditMode) {
      // Additional fields for edit mode
      formData.totalPurchases = parseInt(document.getElementById('totalPurchases').value);
      formData.totalSpent = parseFloat(document.getElementById('totalSpent').value);
      formData.lastPurchase = document.getElementById('lastPurchase').value;
      formData.isFrequent = document.getElementById('isFrequent').checked;
      
      // Update existing customer
      const customerIndex = customers.findIndex(customer => customer.id === customerId);
      if (customerIndex !== -1) {
        customers[customerIndex] = { ...customers[customerIndex], ...formData };
        window.showToast('Success', `Customer ${customerId} has been updated.`, 'success');
        
        // Update selected customer if it's the one being edited
        if (selectedCustomer && selectedCustomer.id === customerId) {
          selectedCustomer = customers[customerIndex];
        }
      }
    } else {
      // Create new customer
      const newCustomer = {
        id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
        ...formData,
        totalPurchases: 0,
        totalSpent: 0,
        isFrequent: false,
        lastPurchase: null,
        avatar: "img/placeholder-avatar.png"
      };
      customers.unshift(newCustomer);
      window.showToast('Success', `Customer ${newCustomer.id} has been registered.`, 'success');
    }
    
    // Close form and refresh table
    closeCustomerForm();
    renderCustomers();
    
    // Update customer detail if open
    if (selectedCustomer && customerDetail && customerDetail.style.display === 'block') {
      openCustomerDetail(selectedCustomer);
    }
  }
  
  // Initialize the page
  init();
});

