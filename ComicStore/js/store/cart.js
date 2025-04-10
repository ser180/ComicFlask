document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cartItemsContainer")
  const cartActions = document.getElementById("cartActions")
  const cartSummary = document.getElementById("cartSummary")
  const emptyCartMessage = document.getElementById("emptyCartMessage")
  const cartSubtotal = document.getElementById("cartSubtotal")
  const cartShipping = document.getElementById("cartShipping")
  const cartDiscount = document.getElementById("cartDiscount")
  const cartTotal = document.getElementById("cartTotal")
  const discountRow = document.getElementById("discountRow")

  // Obtener el carrito del localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || []

  // Función para actualizar la visualización del carrito
  function updateCartDisplay() {
    if (cart.length === 0) {
      emptyCartMessage.style.display = "block"
      cartActions.style.display = "none"
      cartSummary.style.display = "none"
    } else {
      emptyCartMessage.style.display = "none"
      cartActions.style.display = "flex"
      cartSummary.style.display = "block"

      // Limpiar el contenedor de items del carrito
      cartItemsContainer.innerHTML = ""

      // Renderizar cada item del carrito
      cart.forEach((item) => {
        const cartItemElement = createCartItemElement(item)
        cartItemsContainer.appendChild(cartItemElement)
      })

      // Actualizar el resumen del carrito
      updateCartSummary()
    }
  }

  // Función para crear un elemento de item del carrito
  function createCartItemElement(item) {
    const cartItem = document.createElement("div")
    cartItem.className = "cart-item"
    cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <h3>${item.title}</h3>
                <p>Precio: $${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                <input type="number" value="${item.quantity}" min="1" data-id="${item.id}">
                <button class="quantity-btn plus" data-id="${item.id}">+</button>
            </div>
            <div class="cart-item-subtotal">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
            <button class="remove-item" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        `

    return cartItem
  }

  // Función para actualizar el resumen del carrito
  function updateCartSummary() {
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
    const shipping = subtotal > 50 ? 0 : 5 // Envío gratis para pedidos superiores a $50
    const discount = 0 // Implementar lógica de descuento si es necesario
    const total = subtotal + shipping - discount

    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`
    cartShipping.textContent = shipping === 0 ? "Gratis" : `$${shipping.toFixed(2)}`
    cartTotal.textContent = `$${total.toFixed(2)}`

    if (discount > 0) {
      cartDiscount.textContent = `-$${discount.toFixed(2)}`
      discountRow.style.display = "flex"
    } else {
      discountRow.style.display = "none"
    }
  }

  // Evento para actualizar la cantidad de un item
  cartItemsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("quantity-btn")) {
      const id = Number.parseInt(e.target.getAttribute("data-id"))
      const item = cart.find((item) => item.id === id)
      if (item) {
        if (e.target.classList.contains("plus")) {
          item.quantity++
        } else if (e.target.classList.contains("minus") && item.quantity > 1) {
          item.quantity--
        }
        updateCartDisplay()
        localStorage.setItem("cart", JSON.stringify(cart))
      }
    }
  })

  // Evento para eliminar un item del carrito
  cartItemsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-item") || e.target.closest(".remove-item")) {
      const id = Number.parseInt(e.target.closest(".remove-item").getAttribute("data-id"))
      cart = cart.filter((item) => item.id !== id)
      updateCartDisplay()
      localStorage.setItem("cart", JSON.stringify(cart))
    }
  })

  // Evento para actualizar el carrito
  document.querySelector(".update-cart").addEventListener("click", () => {
    updateCartDisplay()
    showToast("Carrito actualizado", "El carrito ha sido actualizado correctamente", "success")
  })

  // Inicializar la visualización del carrito
  updateCartDisplay()
})

