// ==========================================
// 1. LÓGICA DE FILTROS ACTIVOS
// ==========================================
const tarjetas = document.querySelectorAll(".card");
const botonesFiltro = document.querySelectorAll(".filtro-btn");

function filtrarProductos(tipoCorte) {
  tarjetas.forEach((card) => {
    const coincide = tipoCorte === "todos" || card.dataset.corte === tipoCorte;
    card.classList.toggle("oculto", !coincide);
  });
}

botonesFiltro.forEach((boton) => {
  boton.addEventListener("click", () => {
    botonesFiltro.forEach((b) => b.classList.remove("active"));
    boton.classList.add("active");
    const filtroSeleccionado = boton.dataset.filtro;
    filtrarProductos(filtroSeleccionado);
  });
});

// ==========================================
// 2. LÓGICA DEL CARRITO (Estado + Render)
// ==========================================

// 1. ESTADO: Arreglo donde se guardarán los productos seleccionados[cite: 2]
const carrito = [];

// Seleccionamos elementos del DOM para el carrito
const ulListaCarrito = document.querySelector("#lista-carrito");
const contadorHeader = document.querySelector("#counter");
const totalSpan = document.querySelector("#total-carrito");
const cartBtn = document.querySelector("#cart-btn");
const cartModal = document.querySelector("#cart-modal");

// 3. RENDER: Dibuja de nuevo la lista completa en pantalla[cite: 2]
function render() {
  ulListaCarrito.innerHTML = "";
  let acumuladoTotal = 0;

  if (carrito.length === 0) {
    ulListaCarrito.innerHTML = `<li style="color:#666;">El carrito está vacío.</li>`;
  } else {
    // Recorremos el estado (arreglo carrito)
    carrito.forEach((item) => {
      const li = document.createElement("li");
      li.style.cssText = "display:flex; justify-content:space-between; margin-bottom:6px; color:#fff;";
      
      li.innerHTML = `
        <span>${item.nombre}</span>
        <b style="color:var(--lime,#ccff00);">$${item.precio.toLocaleString()}</b>
      `;
      
      ulListaCarrito.appendChild(li);
      acumuladoTotal += item.precio;
    });
  }

  // Actualizamos el contador visual y el total monetario
  contadorHeader.textContent = carrito.length < 10 ? `0${carrito.length}` : carrito.length;
  totalSpan.textContent = `$${acumuladoTotal.toLocaleString()} COP`;
}

// 2. ACCIÓN: Capturamos los clics en los botones de compra[cite: 2]
const botonesComprar = document.querySelectorAll(".card .btn.lime");

botonesComprar.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del enlace

    const card = boton.closest(".card");
    const nombreProducto = card.querySelector("h3").textContent.trim();
    const textoPrecio = card.querySelector(".buy strong").innerText;
    const precioNumerico = parseInt(textoPrecio.replace(/[^0-9]/g, ""), 10);

    // Agregamos al arreglo (Estado) mediante push[cite: 2]
    carrito.push({
      nombre: nombreProducto,
      precio: precioNumerico
    });

    // Actualizamos la interfaz llamando a render()[cite: 2]
    render();

    // Mostramos el modal flotante del carrito automáticamente al añadir
    cartModal.style.display = "block";
  });
});

// Toggle manual para abrir/cerrar el modal del carrito desde el header
cartBtn.addEventListener("click", (e) => {
  e.preventDefault();
  cartModal.style.display = cartModal.style.display === "none" ? "block" : "none";
});