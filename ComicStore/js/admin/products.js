document.addEventListener("DOMContentLoaded", () => {
  const addProductBtn = document.getElementById("addProductBtn")
  const productModal = document.getElementById("productModal")
  const closeModal = document.getElementById("closeModal")
  const productForm = document.getElementById("productForm")
  const modalTitle = document.getElementById("modalTitle")
  const saveProductForm = document.getElementById("saveProductForm")
  const cancelProductForm = document.getElementById("cancelProductForm")

  // Datos de muestra de productos
  const products = [
    {
      id: 1,
      name: "Batman: El Regreso del Caballero Oscuro",
      category: "Cómics",
      publisher: "DC Comics",
      price: 19.99,
      stock: 50,
      image: "../img/products/batman.jpg",
    },
    {
      id: 2,
      name: "Spider-Man: Miles Morales Vol. 1",
      category: "Cómics",
      publisher: "Marvel",
      price: 17.99,
      stock: 8,
      image: "../img/products/spiderman.jpg",
    },
    // Añadir más productos aquí
  ]

  // Function to format currency
  function formatCurrency(number) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(number)
  }

  // Function to show toast messages
  function showToast(title, message, type = "success") {
    const toastContainer = document.getElementById("toast-container")
    const toast = document.createElement("div")
    toast.classList.add("toast", `toast-${type}`)
    toast.innerHTML = `
            <div class="toast-header">
                <strong class="me-auto">${title}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">${message}</div>
        `
    toastContainer.appendChild(toast)

    const toastBootstrap = new bootstrap.Toast(toast)
    toastBootstrap.show()

    toast.querySelector(".btn-close").addEventListener("click", () => {
      toastBootstrap.dispose()
      toast.remove()
    })
  }

  function displayProducts() {
    const tableBody = document.querySelector(".table tbody")
    tableBody.innerHTML = ""

    products.forEach((product) => {
      const row = document.createElement("tr")
      row.innerHTML = `
                <td>
                    <img src="${product.image}" alt="${product.name}" class="product-thumbnail">
                </td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.publisher}</td>
                <td>${formatCurrency(product.price)}</td>
                <td>${product.stock}</td>
                <td>
                    <span class="badge ${product.stock > 10 ? "bg-success" : "bg-warning"}">
                        ${product.stock > 10 ? "En Stock" : "Poco Stock"}
                    </span>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn view-product" data-id="${product.id}" title="Ver">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit-product" data-id="${product.id}" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-product" data-id="${product.id}" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `
      tableBody.appendChild(row)
    })
  }

  function showModal(title) {
    modalTitle.textContent = title
    productModal.style.display = "block"
  }

  function hideModal() {
    productModal.style.display = "none"
    productForm.reset()
  }

  addProductBtn.addEventListener("click", () => {
    showModal("Añadir Nuevo Producto")
  })

  closeModal.addEventListener("click", hideModal)
  cancelProductForm.addEventListener("click", hideModal)

  productForm.addEventListener("submit", (e) => {
    e.preventDefault()
    // Aquí iría la lógica para guardar o actualizar el producto
    // Por ahora, solo cerraremos el modal y mostraremos un mensaje
    hideModal()
    showToast("Éxito", "Producto guardado correctamente", "success")
    displayProducts() // Actualizar la lista de productos
  })

  // Eventos para editar y eliminar productos
  document.querySelector(".table").addEventListener("click", (e) => {
    if (e.target.closest(".edit-product")) {
      const productId = e.target.closest(".edit-product").getAttribute("data-id")
      // Aquí iría la lógica para cargar los datos del producto en el formulario
      showModal("Editar Producto")
    } else if (e.target.closest(".delete-product")) {
      const productId = e.target.closest(".delete-product").getAttribute("data-id")
      if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
        // Aquí iría la lógica para eliminar el producto
        showToast("Éxito", "Producto eliminado correctamente", "success")
        displayProducts() // Actualizar la lista de productos
      }
    }
  })

  // Inicializar la visualización de productos
  displayProducts()
})

