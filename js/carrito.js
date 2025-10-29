// carrito.js
(() => {
  const STORAGE_KEY = 'carrito';

  // 🔧 Utilidades
  const getCarrito = () => JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const guardarCarrito = (carrito) => localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
  const obtenerCantidadTotal = () => getCarrito().reduce((acc, item) => acc + item.cantidad, 0);

  // 🎯 Actualizar contador visual
  const actualizarContador = () => {
    const contador = document.querySelector('.cart-count');
    if (!contador) return;

    const cantidad = obtenerCantidadTotal();
    contador.textContent = cantidad;

    if (cantidad > 0) {
      contador.classList.remove('cart-bump');
      void contador.offsetWidth;
      contador.classList.add('cart-bump');
      setTimeout(() => contador.classList.remove('cart-bump'), 300);
    }
  };

  // 🧾 Renderizar resumen flotante del carrito
  const renderResumenCarrito = () => {
    const contenedor = document.querySelector('.cart-resumen');
    if (!contenedor) return;

    const carrito = getCarrito();
    if (carrito.length === 0) {
      contenedor.innerHTML = '<p class="resumen-vacio">Tu carrito está vacío.</p>';
      return;
    }

    contenedor.innerHTML = carrito.map(item => `
      <div class="item-resumen">
        <strong>${item.nombre}</strong><br>
        Cantidad: ${item.cantidad}<br>
        Precio: $${item.precio.toLocaleString()}
      </div>
      <hr>
    `).join('');

    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    contenedor.innerHTML += `<p class="resumen-total"><strong>Total: $${total.toLocaleString()}</strong></p>`;
  };

  // 🛒 Agregar producto al carrito
  const agregarAlCarrito = (producto) => {
    let carrito = getCarrito();
    const existente = carrito.find(item => item.nombre === producto.nombre);

    if (existente) {
      existente.cantidad += producto.cantidad;
    } else {
      carrito.push(producto);
    }

    guardarCarrito(carrito);
    actualizarContador();
    renderResumenCarrito();
    mostrarToast(`${producto.nombre} agregado al carrito`);
  };

  // 🖱️ Enlazar botones automáticamente
  const enlazarBotones = () => {
    document.querySelectorAll(".btn-comprar").forEach(btn => {
      if (btn.__carritoBind) return;

      btn.addEventListener("click", () => {
        const producto = {
          nombre: btn.dataset.nombre || "Producto sin nombre",
          precio: Number(btn.dataset.precio) || 0,
          cantidad: Math.max(1, Number(btn.dataset.cantidad) || 0),
          imagen: btn.dataset.imagen || "./img/default.jpg" // ✅ Corrección aplicada
        };
        agregarAlCarrito(producto);
      });

      btn.__carritoBind = true;
    });
  };

  // 🔔 Toast elegante
  const mostrarToast = (mensaje) => {
    const toast = document.createElement('div');
    toast.className = 'toast-cart';
    toast.textContent = mensaje;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      toast.addEventListener('transitionend', () => toast.remove());
    }, 2000);
  };

  // 🔄 Sincronizar entre pestañas
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      actualizarContador();
      renderResumenCarrito();
    }
  });

  // 🚀 Inicializar
  document.addEventListener("DOMContentLoaded", () => {
    actualizarContador();
    renderResumenCarrito();
    enlazarBotones();
  });
})();
