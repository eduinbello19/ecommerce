// 1. Seleccionamos las tarjetas de producto y los botones de filtro
const tarjetas = document.querySelectorAll(".card");
const botonesFiltro = document.querySelectorAll(".filtro-btn");

// 2. Función de filtrado utilizando la técnica de dataset y classList.toggle
function filtrarProductos(tipoCorte) {
  tarjetas.forEach((card) => {
    // Si se selecciona "todos", el corte coincide automáticamente
    const coincide = tipoCorte === "todos" || card.dataset.corte === tipoCorte;
    
    // Ocultamos las tarjetas que NO coincidan mediante la clase 'oculto'
    card.classList.toggle("oculto", !coincide);
  });
}

// 3. Agregar los event listeners a cada botón de la barra de filtros
botonesFiltro.forEach((boton) => {
  boton.addEventListener("click", () => {
    // Quitar la clase 'active' de todos los botones y agregarla al presionado
    botonesFiltro.forEach((b) => b.classList.remove("active"));
    boton.classList.add("active");

    // Leer el valor del data-filtro y ejecutar la función de filtrado
    const filtroSeleccionado = boton.dataset.filtro;
    filtrarProductos(filtroSeleccionado);
  });
});