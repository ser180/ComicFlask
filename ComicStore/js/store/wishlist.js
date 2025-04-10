document.addEventListener("DOMContentLoaded", () => {
  const wishlistContainer = document.getElementById("wishlistContainer")
  const emptyWishlist = document.getElementById("emptyWishlist")

  // Obtener la lista de deseos del localStorage
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || []

  function displayWishlist() {
    if (wishlist.length === 0) {
      wishlistContainer.style.display = "none"
      emptyWishlist.style.display = "block"
    } else {
      wishlistContainer.style.display = "grid"
      emptyWishlist.style.display = "none"
      wishlistContainer.innerHTML = ""

      wishlist.forEach((item) => {
        const wishlistItem = document.createElement("div")
        wishlistItem.classList.add("wishlist-item")
        wishlistItem.innerHTML = `
                    <img src="${item.image}" alt="${item.title}" class="item-image">
                    <div class="item-details">
                        <h3>${item.title}</h3>
                        <p class="item-price">€${item.price.toFixed(2)}</p>
                        <button class="btn btn-primary add-to-cart" data-id="${item.id}">Añadir al Carrito</button>
                        <button class="btn btn-outline remove-from-wishlist" data-id="${item.id}">Eliminar</button>
                    </div>
                `
        wishlistContainer.appendChild(wishlistItem)
      })
    }
  }

  displayWishlist()

  // Manejar clic en "Añadir al Carrito"
  wishlistContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart")) {
      const productId = Number.parseInt(e.target.getAttribute("data-id"))
      const product = wishlist.find((item) => item.id === productId)

      if (product) {
        // Añadir al carrito (asumiendo que tienes una función para esto)
        addToCart(product)
        showToast("Añadido al carrito", `${product.title} ha sido añadido a tu carrito`, "success")
      }
    }
  })

  // Manejar clic en "Eliminar"
  wishlistContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-from-wishlist")) {
      const productId = Number.parseInt(e.target.getAttribute("data-id"))
      wishlist = wishlist.filter((item) => item.id !== productId)
      localStorage.setItem("wishlist", JSON.stringify(wishlist))
      displayWishlist()
      showToast("Eliminado de la lista de deseos", "El producto ha sido eliminado de tu lista de deseos", "info")
    }
  })
})

// Función para añadir al carrito (implementar según tu lógica de carrito)
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
  const cartCount = document.getElementById("cartCount")
  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
  cartCount.textContent = totalItems
}

// Función para mostrar notificaciones toast (asumiendo que está definida en main.js)
function showToast(title, message, type) {
  // Implementación de la función showToast
  console.log(`${title}: ${message} (${type})`)
}

