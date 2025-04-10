document.addEventListener("DOMContentLoaded", () => {
  const checkoutForm = document.getElementById("checkoutForm")
  const orderItems = document.getElementById("orderItems")
  const subtotalElement = document.getElementById("subtotal")
  const shippingElement = document.getElementById("shipping")
  const totalElement = document.getElementById("total")
  const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]')
  const creditCardFields = document.getElementById("creditCardFields")

  // Cargar items del carrito
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  function displayOrderItems() {
    orderItems.innerHTML = ""
    let subtotal = 0

    cart.forEach((item) => {
      const itemElement = document.createElement("div")
      itemElement.classList.add("order-item")
      itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="item-image">
                <div class="item-details">
                    <h3>${item.title}</h3>
                    <p>Cantidad: ${item.quantity}</p>
                    <p>Precio: €${item.price.toFixed(2)}</p>
                </div>
            `
      orderItems.appendChild(itemElement)

      subtotal += item.price * item.quantity
    })

    // Calcular totales
    const shipping = subtotal > 50 ? 0 : 5
    const total = subtotal + shipping

    subtotalElement.textContent = `€${subtotal.toFixed(2)}`
    shippingElement.textContent = shipping === 0 ? "Gratis" : `€${shipping.toFixed(2)}`
    totalElement.textContent = `€${total.toFixed(2)}`
  }

  displayOrderItems()

  // Manejar cambio de método de pago
  paymentMethodRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      if (e.target.value === "creditCard") {
        creditCardFields.style.display = "block"
      } else {
        creditCardFields.style.display = "none"
      }
    })
  })

  // Manejar envío del formulario
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Aquí iría la lógica para procesar el pago y crear el pedido
    // Por ahora, solo mostraremos un mensaje de éxito y limpiaremos el carrito

    showToast("Pedido realizado", "Tu pedido ha sido procesado con éxito", "success")

    // Limpiar carrito
    localStorage.removeItem("cart")

    // Redirigir a la página de confirmación
    setTimeout(() => {
      window.location.href = "order-confirmation.html"
    }, 2000)
  })

  // Validación de campos de tarjeta de crédito
  const cardNumber = document.getElementById("cardNumber")
  const expiryDate = document.getElementById("expiryDate")
  const cvv = document.getElementById("cvv")

  cardNumber.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ")
  })

  expiryDate.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").replace(/(\d{2})(?=\d)/, "$1/")
  })

  cvv.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 3)
  })
})

// Función para mostrar notificaciones toast (asumiendo que está definida en main.js)
function showToast(title, message, type) {
  // Implementación de la función showToast
  console.log(`${title}: ${message} (${type})`)
}

