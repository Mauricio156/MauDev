document.addEventListener("DOMContentLoaded", () => {
  // Variables
  const navToggle = document.getElementById("nav-toggle")
  const navMenu = document.getElementById("nav-menu")
  const blurBackground = document.getElementById("blur-background")
  const navLinks = document.querySelectorAll(".nav-link")
  const header = document.querySelector("header")

  // Última posición de scroll
  let lastScrollTop = 0

  // Función para alternar el menú móvil
  function toggleMenu() {
    navToggle.classList.toggle("active")
    navMenu.classList.toggle("active")
    blurBackground.classList.toggle("active")
    document.body.classList.toggle("nav-open")
  }

  // Event listeners para el menú móvil
  if (navToggle) {
    navToggle.addEventListener("click", toggleMenu)
  }

  if (blurBackground) {
    blurBackground.addEventListener("click", toggleMenu)
  }

  // Cerrar menú al hacer clic en un enlace
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("active")) {
        toggleMenu()
      }
    })
  })

  // Ocultar/mostrar header al hacer scroll
  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    if (scrollTop > lastScrollTop && scrollTop > 200) {
      // Scroll hacia abajo
      header.classList.add("header-hidden")
    } else {
      // Scroll hacia arriba
      header.classList.remove("header-hidden")
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop
  })

  // Resaltar enlace activo según la sección visible
  function highlightNavLink() {
    const sections = document.querySelectorAll("section[id]")
    const scrollY = window.pageYOffset

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight
      const sectionTop = section.offsetTop - 100
      const sectionId = section.getAttribute("id")

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.add("active")
      } else {
        document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.remove("active")
      }
    })
  }

  window.addEventListener("scroll", highlightNavLink)

  // Funcionalidad para la página de login/registro
  const authTabs = document.querySelectorAll(".auth-tab")
  const loginForm = document.getElementById("login-form")
  const registerForm = document.getElementById("register-form")
  const togglePasswordBtns = document.querySelectorAll(".toggle-password")
  const passwordInput = document.getElementById("register-password")
  const strengthMeter = document.querySelector(".strength-meter-fill")

  // Cambiar entre formularios de login y registro
  if (authTabs.length > 0) {
    authTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const tabType = tab.getAttribute("data-tab")

        // Actualizar pestañas activas
        authTabs.forEach((t) => t.classList.remove("active"))
        tab.classList.add("active")

        // Mostrar formulario correspondiente
        if (tabType === "login") {
          loginForm.classList.remove("hidden")
          registerForm.classList.add("hidden")
        } else {
          loginForm.classList.add("hidden")
          registerForm.classList.remove("hidden")
        }

        // Actualizar URL con parámetro de pestaña
        const url = new URL(window.location.href)
        url.searchParams.set("tab", tabType)
        window.history.replaceState({}, "", url)
      })
    })

    // Verificar si hay un parámetro de pestaña en la URL
    const urlParams = new URLSearchParams(window.location.search)
    const tabParam = urlParams.get("tab")

    if (tabParam === "register") {
      document.querySelector('.auth-tab[data-tab="register"]').click()
    }
  }

  // Mostrar/ocultar contraseña
  if (togglePasswordBtns.length > 0) {
    togglePasswordBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const input = btn.parentElement.querySelector("input")
        const icon = btn.querySelector("i")

        if (input.type === "password") {
          input.type = "text"
          icon.classList.remove("fa-eye")
          icon.classList.add("fa-eye-slash")
        } else {
          input.type = "password"
          icon.classList.remove("fa-eye-slash")
          icon.classList.add("fa-eye")
        }
      })
    })
  }

  // Medidor de seguridad de contraseña
  if (passwordInput && strengthMeter) {
    passwordInput.addEventListener("input", () => {
      const password = passwordInput.value
      let strength = 0

      // Verificar longitud
      if (password.length >= 8) {
        strength += 1
      }

      // Verificar mayúsculas y minúsculas
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
        strength += 1
      }

      // Verificar números
      if (/[0-9]/.test(password)) {
        strength += 1
      }

      // Verificar caracteres especiales
      if (/[^a-zA-Z0-9]/.test(password)) {
        strength += 1
      }

      // Actualizar medidor
      strengthMeter.setAttribute("data-strength", strength)
    })
  }

  // Mostrar mensajes de error o éxito
  function showNotification(type, message) {
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.textContent = message

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.classList.add("show")
    }, 100)

    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 5000)
  }

  // Verificar parámetros de URL para mostrar notificaciones
  const urlParams = new URLSearchParams(window.location.search)

  if (urlParams.has("login")) {
    if (urlParams.get("login") === "success") {
      showNotification("success", "¡Inicio de sesión exitoso!")
    }
  }

  if (urlParams.has("register")) {
    if (urlParams.get("register") === "success") {
      showNotification("success", "¡Registro exitoso! Bienvenido a mauDEV.")
    }
  }

  if (urlParams.has("contact")) {
    const contactStatus = urlParams.get("contact")
    if (contactStatus === "success") {
      showNotification("success", "¡Mensaje enviado correctamente! Te responderé pronto.")
    } else if (contactStatus === "error") {
      showNotification("error", "Error al enviar el mensaje. Inténtalo de nuevo.")
    }
  }

  if (urlParams.has("newsletter")) {
    const newsletterStatus = urlParams.get("newsletter")
    if (newsletterStatus === "success") {
      showNotification("success", "¡Te has suscrito al newsletter exitosamente!")
    } else if (newsletterStatus === "already_subscribed") {
      showNotification("info", "Ya estás suscrito al newsletter.")
    } else if (newsletterStatus === "error") {
      showNotification("error", "Error al suscribirse. Inténtalo de nuevo.")
    }
  }

  // Animaciones con Anime.js
  if (typeof anime !== "undefined") {
    // Animación del hero al cargar
    anime
      .timeline({
        easing: "easeOutExpo",
      })
      .add({
        targets: ".hero-title",
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1000,
      })
      .add(
        {
          targets: ".hero-description",
          opacity: [0, 1],
          translateY: [30, 0],
          duration: 800,
        },
        "-=600",
      )
      .add(
        {
          targets: ".cta-buttons .btn",
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 600,
          delay: anime.stagger(100),
        },
        "-=400",
      )
      .add(
        {
          targets: ".hero-image img",
          opacity: [0, 1],
          scale: [0.8, 1],
          duration: 1000,
        },
        "-=800",
      )

    // Animación de las cards al hacer scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll(".project-card, .blog-card, .product-card")

          anime({
            targets: cards,
            opacity: [0, 1],
            translateY: [50, 0],
            duration: 800,
            delay: anime.stagger(100),
            easing: "easeOutExpo",
          })

          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    // Observar secciones
    const sections = document.querySelectorAll(".projects, .blog, .shop-products")
    sections.forEach((section) => observer.observe(section))

    // Animación del título de sección
    const titleObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          anime({
            targets: entry.target,
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            easing: "easeOutExpo",
          })
          titleObserver.unobserve(entry.target)
        }
      })
    }, observerOptions)

    const titles = document.querySelectorAll(".section-title")
    titles.forEach((title) => titleObserver.observe(title))
  }

  // Smooth scroll para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Hacer disponible la función showNotification globalmente
  window.showNotification = showNotification
})
