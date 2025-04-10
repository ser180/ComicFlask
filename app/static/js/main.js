// Funcionalidad común para todas las páginas
document.addEventListener("DOMContentLoaded", () => {
  // Alternar menú móvil
  const menuToggle = document.getElementById("menuToggle")
  const sidebar = document.querySelector(".sidebar")

  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active")
    })
  }

  // Funcionalidad de pestañas
  const tabItems = document.querySelectorAll(".tab-item")

  tabItems.forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab")

      // Eliminar clase activa de todas las pestañas y contenido
      document.querySelectorAll(".tab-item").forEach((item) => {
        item.classList.remove("active")
      })

      document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.remove("active")
      })

      // Añadir clase activa a la pestaña clickeada y su contenido correspondiente
      this.classList.add("active")
      const tabContent = document.getElementById(`tab-${tabId}`)
      if (tabContent) {
        tabContent.classList.add("active")
      }
    })
  })

  // Funcionalidad de desplegables
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle")

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", function (e) {
      e.stopPropagation()
      const dropdown = this.closest(".dropdown")
      dropdown.classList.toggle("active")
    })
  })

  // Cerrar desplegables al hacer clic fuera
  document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown.active").forEach((dropdown) => {
      dropdown.classList.remove("active")
    })
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

