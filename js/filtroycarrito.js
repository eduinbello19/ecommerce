// ==========================================
// 1. SELECTOR DE TALLAS (Lógica original directa)
// ==========================================
const tallas = document.querySelectorAll(".tallas button");

tallas.forEach((b) => {
    b.addEventListener("click", () => {
        const estadoActual = b.getAttribute("aria-pressed") === "true";
        b.setAttribute("aria-pressed", !estadoActual);
    });
});

// ==========================================
// 2. FILTROS ACTIVOS (Por tipo de corte)
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
// 3. CARRITO DINÁMICO (Estado, Push y Render)
// ==========================================

// 1. ESTADO: Arreglo del carrito[cite: 2]
const carrito = [];

const ulListaCarrito = document.querySelector("#lista-carrito");
const contadorHeader = document.querySelector("#counter");
const totalSpan = document.querySelector("#total-carrito");
const cartBtn = document.querySelector("#cart-btn");
const cartModal = document.querySelector("#cart-modal");

// 3. RENDER: Dibuja de nuevo la lista completa en pantalla y actualiza totales[cite: 2]
function render() {
  ulListaCarrito.innerHTML = "";
  let acumuladoTotal = 0;

  if (carrito.length === 0) {
    ulListaCarrito.innerHTML = `<li style="color:#666;">El carrito está vacío.</li>`;
  } else {
    carrito.forEach((item) => {
      const li = document.createElement("li");
      li.style.cssText = "display:flex; justify-content:space-between; margin-bottom:6px; color:#fff; align-items:center;";
      
      li.innerHTML = `
        <div>
          <span>${item.nombre}</span><br>
          <small style="color:var(--lime,#ccff00);">Talla: ${item.talla}</small>
        </div>
        <b style="color:var(--lime,#ccff00);">$${item.precio.toLocaleString()}</b>
      `;
      
      ulListaCarrito.appendChild(li);
      acumuladoTotal += item.precio;
    });
  }

  contadorHeader.textContent = carrito.length < 10 ? `0${carrito.length}` : carrito.length;
  totalSpan.textContent = `$${acumuladoTotal.toLocaleString()} COP`;
}

// 2. ACCIÓN: Capturamos clics en comprar y usamos push[cite: 2]
const botonesComprar = document.querySelectorAll(".card .btn.lime");

botonesComprar.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    e.preventDefault();

    // Detectar qué talla está marcada (aria-pressed="true")
    const tallasSeleccionadas = document.querySelectorAll(".tallas button[aria-pressed='true']");
    let tallaElegida = "M"; // Valor por defecto si no hay ninguna seleccionada
    if (tallasSeleccionadas.length > 0) {
      tallaElegida = tallasSeleccionadas[0].textContent;
    }

    const card = boton.closest(".card");
    const nombreProducto = card.querySelector("h3").textContent.trim();
    const textoPrecio = card.querySelector(".buy strong").innerText;
    const precioNumerico = parseInt(textoPrecio.replace(/[^0-9]/g, ""), 10);

    // Agregamos al arreglo (Estado) mediante push[cite: 2]
    carrito.push({
      nombre: nombreProducto,
      talla: tallaElegida,
      precio: precioNumerico
    });

    // Llamamos a render() para actualizar la interfaz[cite: 2]
    render();

    // Mostrar modal del carrito
    cartModal.style.display = "block";
  });
});

// Toggle para abrir/cerrar el modal del carrito
cartBtn.addEventListener("click", (e) => {
  e.preventDefault();
  cartModal.style.display = cartModal.style.display === "none" ? "block" : "none";
});