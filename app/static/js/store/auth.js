document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm")
    const registerForm = document.getElementById("registerForm")
  
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        // Aquí iría la lógica de inicio de sesión
        console.log("Inicio de sesión:", email, password)
        // Ejemplo de redirección después del inicio de sesión
        // window.location.href = 'index.html';
      })
    }
  
    if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const name = document.getElementById("name").value
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        const confirmPassword = document.getElementById("confirmPassword").value
  
        if (password !== confirmPassword) {
          alert("Las contraseñas no coinciden")
          return
        }
  
        // Aquí iría la lógica de registro
        console.log("Registro:", name, email, password)
        // Ejemplo de redirección después del registro
        // window.location.href = 'index.html';
      })
    }
  })
  
  