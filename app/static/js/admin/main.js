document.addEventListener("DOMContentLoaded", () => {
  // Funcionalidad del toggle de la barra lateral
  const sidebarToggle = document.getElementById("sidebarToggle")
  const sidebar = document.querySelector(".sidebar")
  const mainContent = document.querySelector(".main-content")

  if (sidebarToggle && sidebar && mainContent) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed")
      mainContent.classList.toggle("expanded")
    })
  }

  // Funcionalidad de los dropdowns
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle")

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.preventDefault()
      const dropdown = toggle.closest(".dropdown")
      dropdown.classList.toggle("active")

      // Cerrar otros dropdowns
      dropdownToggles.forEach((otherToggle) => {
        if (otherToggle !== toggle) {
          otherToggle.closest(".dropdown").classList.remove("active")
        }
      })
    })
  })

  // Cerrar dropdowns al hacer clic fuera
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) {
      dropdownToggles.forEach((toggle) => {
        toggle.closest(".dropdown").classList.remove("active")
      })
    }
  })

  // Sistema de notificaciones toast
  window.showToast = (title, message, type = "info") => {
    const toast = document.createElement("div")
    toast.className = `toast toast-${type}`
    toast.innerHTML = `
            <div class="toast-header">
                <strong>${title}</strong>
                <button class="close-button">×</button>
            </div>
            <div class="toast-body">${message}</div>
        `

    // Crear contenedor de toast si no existe
    let toastContainer = document.querySelector(".toast-container")
    if (!toastContainer) {
      toastContainer = document.createElement("div")
      toastContainer.className = "toast-container"
      document.body.appendChild(toastContainer)
    }

    toastContainer.appendChild(toast)

    // Auto-eliminar toast después de 5 segundos
    setTimeout(() => {
      toast.classList.add("toast-hiding")
      setTimeout(() => {
        toast.remove()
      }, 300)
    }, 5000)

    // Funcionalidad del botón de cerrar
    toast.querySelector(".close-button").addEventListener("click", () => {
      toast.classList.add("toast-hiding")
      setTimeout(() => {
        toast.remove()
      }, 300)
    })
  }

  // Funcionalidad de las pestañas
  const tabItems = document.querySelectorAll(".tab-item")
  tabItems.forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab")

      // Remover clase activa de todas las pestañas y contenidos
      document.querySelectorAll(".tab-item").forEach((item) => item.classList.remove("active"))
      document.querySelectorAll(".tab-content").forEach((content) => content.classList.remove("active"))

      // Añadir clase activa a la pestaña clickeada y su contenido correspondiente
      this.classList.add("active")
      const activeContent = document.getElementById(`tab-${tabId}`)
      if (activeContent) {
        activeContent.classList.add("active")
      }
    })
  })
})

// Función auxiliar para formatear fechas
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Función auxiliar para formatear moneda
function formatCurrency(amount) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(amount)
}

