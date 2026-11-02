const botonSuma = document.querySelector("#suma");
const botonResta = document.querySelector("#resta");
const salida = document.querySelector("#salida");
let valor = 0;

botonSuma.addEventListener("click", (e) => {
    valor = valor + 1;
    salida.textContent = valor;
});

botonResta.addEventListener("click", (e) => {
    valor = valor - 1;
    salida.textContent = valor;
});