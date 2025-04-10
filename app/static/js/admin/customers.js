document.addEventListener("DOMContentLoaded", () => {
    const customersTableBody = document.getElementById("customersTableBody")
    const addCustomerBtn = document.getElementById("addCustomerBtn")
    const customerModal = document.getElementById("customerModal")
    const customerForm = document.getElementById("customerForm")
    const modalTitle = document.getElementById("modalTitle")
    const closeModal = customerModal.querySelector(".close")
  
    let customers = [
      { id: 1, name: "Juan Pérez", email: "juan@example.com", phone: "123-456-7890", registrationDate: "2025-01-15" },
      { id: 2, name: "María García", email: "maria@example.com", phone: "098-765-4321", registrationDate: "2025-02-20" },
      // Agrega más clientes de ejemplo aquí
    ]
  
    function displayCustomers() {
      customersTableBody.innerHTML = ""
      customers.forEach((customer) => {
        const row = document.createElement("tr")
        row.innerHTML = `
                  <td>${customer.id}</td>
                  <td>${customer.name}</td>
                  <td>${customer.email}</td>
                  <td>${customer.phone}</td>
                  <td>${customer.registrationDate}</td>
                  <td>
                      <button class="btn btn-sm btn-edit" data-id="${customer.id}">
                          <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn btn-sm btn-delete" data-id="${customer.id}">
                          <i class="fas fa-trash"></i>
                      </button>
                  </td>
              `
        customersTableBody.appendChild(row)
      })
    }
  
    function showModal(title, customer = null) {
      modalTitle.textContent = title
      if (customer) {
        document.getElementById("customerId").value = customer.id
        document.getElementById("customerName").value = customer.name
        document.getElementById("customerEmail").value = customer.email
        document.getElementById("customerPhone").value = customer.phone
        document.getElementById("customerAddress").value = customer.address || ""
      } else {
        customerForm.reset()
        document.getElementById("customerId").value = ""
      }
      customerModal.style.display = "block"
    }
  
    addCustomerBtn.addEventListener("click", () => showModal("Agregar Nuevo Cliente"))
  
    closeModal.addEventListener("click", () => {
      customerModal.style.display = "none"
    })
  
    customerForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const customerId = document.getElementById("customerId").value
      const customer = {
        id: customerId ? Number.parseInt(customerId) : customers.length + 1,
        name: document.getElementById("customerName").value,
        email: document.getElementById("customerEmail").value,
        phone: document.getElementById("customerPhone").value,
        address: document.getElementById("customerAddress").value,
        registrationDate: customerId ? "" : new Date().toISOString().split("T")[0],
      }
  
      if (customerId) {
        const index = customers.findIndex((c) => c.id === Number.parseInt(customerId))
        customers[index] = { ...customers[index], ...customer }
      } else {
        customers.push(customer)
      }
  
      displayCustomers()
      customerModal.style.display = "none"
    })
  
    customersTableBody.addEventListener("click", (e) => {
      if (e.target.closest(".btn-edit")) {
        const customerId = e.target.closest(".btn-edit").dataset.id
        const customer = customers.find((c) => c.id === Number.parseInt(customerId))
        showModal("Editar Cliente", customer)
      } else if (e.target.closest(".btn-delete")) {
        const customerId = e.target.closest(".btn-delete").dataset.id
        if (confirm("¿Estás seguro de que quieres eliminar este cliente?")) {
          customers = customers.filter((c) => c.id !== Number.parseInt(customerId))
          displayCustomers()
        }
      }
    })
  
    displayCustomers()
  })
  
  