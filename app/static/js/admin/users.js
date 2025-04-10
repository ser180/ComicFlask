document.addEventListener("DOMContentLoaded", () => {
    const userTableBody = document.getElementById("userTableBody")
    const addUserBtn = document.getElementById("addUserBtn")
    const userModal = document.getElementById("userModal")
    const userForm = document.getElementById("userForm")
    const cancelBtn = document.getElementById("cancelBtn")
    const modalTitle = document.getElementById("modalTitle")
  
    let users = [
      { id: 1, name: "Admin User", email: "admin@example.com", role: "admin", status: "active" },
      { id: 2, name: "Editor User", email: "editor@example.com", role: "editor", status: "active" },
      { id: 3, name: "Viewer User", email: "viewer@example.com", role: "viewer", status: "inactive" },
    ]
  
    function renderUsers() {
      userTableBody.innerHTML = ""
      users.forEach((user) => {
        const row = document.createElement("tr")
        row.innerHTML = `
                  <td>${user.id}</td>
                  <td>${user.name}</td>
                  <td>${user.email}</td>
                  <td>${user.role}</td>
                  <td><span class="badge ${user.status === "active" ? "bg-success" : "bg-danger"}">${user.status}</span></td>
                  <td>
                      <button class="action-btn edit-btn" data-id="${user.id}"><i class="fas fa-edit"></i></button>
                      <button class="action-btn delete-btn" data-id="${user.id}"><i class="fas fa-trash-alt"></i></button>
                  </td>
              `
        userTableBody.appendChild(row)
      })
    }
  
    function showModal(title, user = null) {
      modalTitle.textContent = title
      if (user) {
        document.getElementById("userName").value = user.name
        document.getElementById("userEmail").value = user.email
        document.getElementById("userRole").value = user.role
        document.getElementById("userStatus").value = user.status
        userForm.dataset.id = user.id
      } else {
        userForm.reset()
        delete userForm.dataset.id
      }
      userModal.style.display = "block"
    }
  
    function hideModal() {
      userModal.style.display = "none"
    }
  
    addUserBtn.addEventListener("click", () => showModal("Agregar Usuario"))
  
    cancelBtn.addEventListener("click", hideModal)
  
    userForm.addEventListener("submit", function (e) {
      e.preventDefault()
      const userData = {
        name: document.getElementById("userName").value,
        email: document.getElementById("userEmail").value,
        role: document.getElementById("userRole").value,
        status: document.getElementById("userStatus").value,
      }
  
      if (this.dataset.id) {
        // Editar usuario existente
        const index = users.findIndex((u) => u.id === Number.parseInt(this.dataset.id))
        users[index] = { ...users[index], ...userData }
      } else {
        // Agregar nuevo usuario
        const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1
        users.push({ id: newId, ...userData })
      }
  
      renderUsers()
      hideModal()
    })
  
    userTableBody.addEventListener("click", (e) => {
      if (e.target.closest(".edit-btn")) {
        const userId = Number.parseInt(e.target.closest(".edit-btn").dataset.id)
        const user = users.find((u) => u.id === userId)
        showModal("Editar Usuario", user)
      } else if (e.target.closest(".delete-btn")) {
        const userId = Number.parseInt(e.target.closest(".delete-btn").dataset.id)
        if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
          users = users.filter((u) => u.id !== userId)
          renderUsers()
        }
      }
    })
  
    renderUsers()
  })
  
  