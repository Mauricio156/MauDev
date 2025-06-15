// Datos de productos
const products = [
  {
    id: 1,
    name: "Camiseta Negra con Logo",
    description: "Camiseta de algodón orgánico con diseño exclusivo",
    price: 250.0,
      image: "assets/images/id1_shop.png?height=250&width=250",
    category: "Ropa",
    badge: "Nuevo",
  },
  {
    id: 2,
    name: "Camiseta Blanca con Logo",
    description: "Camiseta de algodón orgánico con diseño exclusivo",
    price: 300.0,
    image: "assets/images/id2_shop.png?height=250&width=250",
    category: "Ropa",
    badge: "Popular",
  },
  {
    id: 3,
    name: "Sudadera de color negro",
    description: "Sudadera de algodón orgánico con diseño exclusivo",
    price: 280.0,
    image: "assets/images/id3_shop.png?height=250&width=250",
    category: "Ropa",
  },
  {
    id: 4,
    name: "Funda para teléfono",
    description: "Funda premium con logo de Maudev",
    price: 450.0,
    image: "assets/images/id4_shop.png?height=250&width=250",
    category: "Accesorios",
    badge: "Bestseller",
  },
  {
    id: 5,
    name: "Cuadro de Pared",
    description: "Cuadro decorativo con diseño exclusivo de Maudev",
    price: 650.0,
    image: "assets/images/id5_shop.png?height=250&width=250",
    category: "Pinturas",
  },
  {
    id: 6,
    name: "Taza de Café Coder",
    description: "Taza térmica perfecta para desarrolladores",
    price: 200.0,
    image: "assets/images/id6_shop.png?height=250&width=250",
    category: "Accesorios",
  },
]

// Carrito de compras
let cart = JSON.parse(localStorage.getItem("maudev_cart")) || []

document.addEventListener("DOMContentLoaded", () => {
  const productsGrid = document.getElementById("products-grid")
  const filterBtns = document.querySelectorAll(".filter-btn")
  const sortSelect = document.getElementById("sort-select")
  const cartToggle = document.getElementById("cart-toggle")
  const cartSidebar = document.getElementById("cart-sidebar")
  const cartClose = document.getElementById("cart-close")
  const cartCount = document.getElementById("cart-count")

  // Renderizar productos
  function renderProducts(productsToRender = products) {
    productsGrid.innerHTML = ""

    productsToRender.forEach((product, index) => {
      const productCard = document.createElement("div")
      productCard.className = "product-card"
      productCard.style.opacity = "0"
      productCard.style.transform = "translateY(30px)"

      productCard.innerHTML = `
        <div class="product-image-container">
          <img src="${product.image}" alt="${product.name}" class="product-image" />
          ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <div class="product-price">$${product.price.toFixed(2)}</div>
          <button class="add-to-cart" data-product-id="${product.id}">
            <i class="fas fa-cart-plus"></i>
            Agregar al Carrito
          </button>
        </div>
      `

      productsGrid.appendChild(productCard)

      // Animación con anime.js
      if (typeof anime !== "undefined") {
        anime({
          targets: productCard,
          opacity: [0, 1],
          translateY: [30, 0],
          duration: 600,
          delay: index * 100,
          easing: "easeOutExpo",
        })
      }
    })

    // Agregar event listeners a los botones
    document.querySelectorAll(".add-to-cart").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productId = Number.parseInt(e.target.closest(".add-to-cart").dataset.productId)
        addToCart(productId)

        // Animación del botón
        if (typeof anime !== "undefined") {
          anime({
            targets: e.target.closest(".add-to-cart"),
            scale: [1, 0.95, 1],
            duration: 200,
            easing: "easeInOutQuad",
          })
        }
      })
    })
  }

  // Filtrar productos
  function filterProducts(category) {
    if (category === "all") {
      return products
    }
    return products.filter((product) => product.category === category)
  }

  // Ordenar productos
  function sortProducts(productsToSort, sortBy) {
    const sorted = [...productsToSort]

    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price)
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price)
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      default:
        return sorted
    }
  }

  // Agregar al carrito
  function addToCart(productId) {
    const product = products.find((p) => p.id === productId)
    const existingItem = cart.find((item) => item.id === productId)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        ...product,
        quantity: 1,
      })
    }

    updateCartUI()
    saveCart()

    // Mostrar notificación
    if (window.showNotification) {
      window.showNotification("success", `${product.name} agregado al carrito`)
    }
  }

  // Actualizar UI del carrito
  function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    cartCount.textContent = totalItems

    const cartItems = document.getElementById("cart-items")
    const cartTotal = document.getElementById("cart-total")

    if (cart.length === 0) {
      cartItems.innerHTML =
        '<p style="text-align: center; color: var(--gray); padding: 2rem;">Tu carrito está vacío</p>'
    } else {
      cartItems.innerHTML = cart
        .map(
          (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
          <div class="cart-item-info">
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
          </div>
          <button class="remove-item" data-product-id="${item.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `,
        )
        .join("")

      // Event listeners para remover items
      document.querySelectorAll(".remove-item").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const productId = Number.parseInt(e.target.closest(".remove-item").dataset.productId)
          removeFromCart(productId)
        })
      })
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    cartTotal.textContent = total.toFixed(2)
  }

  // Remover del carrito
  function removeFromCart(productId) {
    cart = cart.filter((item) => item.id !== productId)
    updateCartUI()
    saveCart()
  }

  // Guardar carrito en localStorage
  function saveCart() {
    localStorage.setItem("maudev_cart", JSON.stringify(cart))
  }

  // Event listeners
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      const category = btn.dataset.filter
      const filtered = filterProducts(category)
      const sorted = sortProducts(filtered, sortSelect.value)
      renderProducts(sorted)
    })
  })

  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      const activeFilter = document.querySelector(".filter-btn.active").dataset.filter
      const filtered = filterProducts(activeFilter)
      const sorted = sortProducts(filtered, sortSelect.value)
      renderProducts(sorted)
    })
  }

  // Carrito sidebar
  if (cartToggle) {
    cartToggle.addEventListener("click", (e) => {
      e.preventDefault()
      cartSidebar.classList.add("active")
      document.body.style.overflow = "hidden"
    })
  }

  if (cartClose) {
    cartClose.addEventListener("click", () => {
      cartSidebar.classList.remove("active")
      document.body.style.overflow = "auto"
    })
  }

  // Cerrar carrito al hacer clic fuera
  document.addEventListener("click", (e) => {
    if (cartSidebar.classList.contains("active") && !cartSidebar.contains(e.target) && !cartToggle.contains(e.target)) {
      cartSidebar.classList.remove("active")
      document.body.style.overflow = "auto"
    }
  })

  // Inicializar
  renderProducts()
  updateCartUI()
})
