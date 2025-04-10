document.addEventListener("DOMContentLoaded", () => {
  // Funcionalidad de las imágenes en miniatura
  const mainImage = document.getElementById("mainImage")
  const thumbnails = document.querySelectorAll(".thumbnail")

  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", function () {
      mainImage.src = this.getAttribute("data-image")
      thumbnails.forEach((t) => t.classList.remove("active"))
      this.classList.add("active")
    })
  })

  // Funcionalidad del selector de cantidad
  const quantityInput = document.querySelector(".quantity-input")
  const minusBtn = document.querySelector(".quantity-btn.minus")
  const plusBtn = document.querySelector(".quantity-btn.plus")

  minusBtn.addEventListener("click", () => {
    const value = Number.parseInt(quantityInput.value)
    if (value > 1) {
      quantityInput.value = value - 1
    }
  })

  plusBtn.addEventListener("click", () => {
    const value = Number.parseInt(quantityInput.value)
    if (value < 10) {
      quantityInput.value = value + 1
    }
  })

  // Funcionalidad de las pestañas
  const tabBtns = document.querySelectorAll(".tab-btn")
  const tabPanes = document.querySelectorAll(".tab-pane")

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab")

      tabBtns.forEach((b) => b.classList.remove("active"))
      tabPanes.forEach((p) => p.classList.remove("active"))

      this.classList.add("active")
      document.getElementById(tabId).classList.add("active")
    })
  })

  // Funcionalidad de añadir al carrito
  const addToCartBtn = document.querySelector(".add-to-cart")
  addToCartBtn.addEventListener("click", function () {
    const productId = this.getAttribute("data-id")
    const quantity = Number.parseInt(quantityInput.value)

    // Aquí iría la lógica para añadir el producto al carrito
    // Por ahora, solo mostraremos un mensaje de éxito
    showToast("Producto añadido", `Se han añadido ${quantity} unidades al carrito`, "success")
  })

  // Funcionalidad de añadir a favoritos
  const addToWishlistBtn = document.querySelector(".add-to-wishlist")
  addToWishlistBtn.addEventListener("click", () => {
    // Aquí iría la lógica para añadir el producto a la lista de deseos
    // Por ahora, solo mostraremos un mensaje de éxito
    showToast("Añadido a favoritos", "El producto se ha añadido a tu lista de deseos", "success")
  })

  // Funcionalidad del formulario de reseñas
  const reviewForm = document.getElementById("reviewForm")
  reviewForm.addEventListener("submit", function (e) {
    e.preventDefault()

    // Aquí iría la lógica para enviar la reseña
    // Por ahora, solo mostraremos un mensaje de éxito
    showToast("Reseña enviada", "Gracias por compartir tu opinión", "success")
    this.reset()
  })
})

// Función para mostrar notificaciones toast (asumiendo que está definida en main.js)
function showToast(title, message, type) {
  // Implementación de la función showToast
  console.log(`${title}: ${message} (${type})`)
}

