document.addEventListener("DOMContentLoaded", () => {
  // Alternar menú móvil
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")
  const mobileMenu = document.querySelector(".mobile-menu")
  const mobileMenuClose = document.querySelector(".mobile-menu-close")

  if (mobileMenuToggle && mobileMenu && mobileMenuClose) {
    mobileMenuToggle.addEventListener("click", () => {
      mobileMenu.classList.add("active")
      document.body.style.overflow = "hidden"
    })

    mobileMenuClose.addEventListener("click", () => {
      mobileMenu.classList.remove("active")
      document.body.style.overflow = ""
    })
  }

  // Funcionalidad del carrito
  const addToCartBtns = document.querySelectorAll(".add-to-cart")
  const cartCount = document.querySelector(".cart-count")
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  // Función para mostrar notificaciones toast
  window.showToast = (title, message, type) => {
    const toast = document.createElement("div")
    toast.className = `toast toast-${type}`
    toast.innerHTML = `
            <div class="toast-header">
                <strong>${title}</strong>
                <button class="close-button">×</button>
            </div>
            <div class="toast-body">${message}</div>
        `

    let toastContainer = document.querySelector(".toast-container")
    if (!toastContainer) {
      toastContainer = document.createElement("div")
      toastContainer.className = "toast-container"
      document.body.appendChild(toastContainer)
    }

    toastContainer.appendChild(toast)

    setTimeout(() => {
      toast.classList.add("toast-hiding")
      setTimeout(() => {
        toast.remove()
      }, 300)
    }, 5000)

    toast.querySelector(".close-button").addEventListener("click", () => {
      toast.classList.add("toast-hiding")
      setTimeout(() => {
        toast.remove()
      }, 300)
    })
  }

  if (addToCartBtns.length > 0) {
    updateCartCount()

    addToCartBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault()
        const productId = Number.parseInt(this.getAttribute("data-id"))
        const product = getProductById(productId)

        if (product) {
          addToCart(product)
          showToast("Producto añadido", `${product.title} ha sido añadido a tu carrito`, "success")
        }
      })
    })
  }

  // Funcionalidad de vista rápida de producto
  const quickViewBtns = document.querySelectorAll(".quick-view")
  const quickViewModal = document.getElementById("quickViewModal")
  const modalClose = document.querySelector(".modal-close")

  if (quickViewBtns.length > 0 && quickViewModal) {
    quickViewBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault()
        const productId = Number.parseInt(this.getAttribute("data-id"))
        const product = getProductById(productId)

        if (product) {
          fillQuickViewModal(product)
          quickViewModal.classList.add("active")
          document.body.style.overflow = "hidden"
        }
      })
    })

    if (modalClose) {
      modalClose.addEventListener("click", () => {
        quickViewModal.classList.remove("active")
        document.body.style.overflow = ""
      })
    }
  }
})

// Función para obtener un producto por su ID (simulada)
function getProductById(id) {
  // Aquí deberías implementar la lógica para obtener el producto de tu base de datos o API
  // Por ahora, retornamos un producto de ejemplo
  return {
    id: id,
    title: "Producto de Ejemplo",
    price: 19.99,
    image: "/img/products/example.jpg",
    description: "Esta es una descripción de ejemplo para el producto.",
    category: "Cómics",
    publisher: "Editorial de Ejemplo",
    stock: 10,
    reviews: 5,
  }
}

// Función para añadir al carrito
function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const existingItem = cart.find((item) => item.id === product.id)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({ ...product, quantity: 1 })
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
}

// Función para actualizar el contador del carrito
function updateCartCount() {
  const cartCount = document.querySelector(".cart-count")
  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
  if (cartCount) {
    cartCount.textContent = totalItems
  }
}

// Función para llenar el modal de vista rápida
function fillQuickViewModal(product) {
  document.getElementById("quickViewTitle").textContent = product.title
  document.getElementById("quickViewImage").src = product.image
  document.getElementById("quickViewPrice").textContent = `€${product.price.toFixed(2)}`
  document.getElementById("quickViewDescription").textContent = product.description
  document.getElementById("quickViewCategory").textContent = product.category
  document.getElementById("quickViewPublisher").textContent = product.publisher
  document.getElementById("quickViewStock").textContent = product.stock > 0 ? "En Stock" : "Agotado"
  document.getElementById("quickViewRating").textContent = `(${product.reviews} reseñas)`
}

// Función auxiliar para formatear moneda
function formatCurrency(amount) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(amount)
}

