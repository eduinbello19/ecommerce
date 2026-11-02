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

const formularioRegistro = document.querySelector("#registro");

const saludo = document.querySelector("#saludo");
let nombreSaludo ="";

formularioRegistro.addEventListener("submit", (e)=>{
    e.preventDefault();

    const campoNombre = document.querySelector("#nombre");
    const nombre = campoNombre.value.trim();
    
    if(nombre === ""){
        alert("Digite su nombre");
        console.log("Digite su nombre");
    }else{
saludo.textContent = "Hola, Bienvenid@ " + nombre
    }
})