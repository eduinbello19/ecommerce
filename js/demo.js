const grid = document.querySelector(".grid");

const tarjetas = document.querySelectorAll(".card");




const tituloProducto = document.querySelector(".card .body h3");

console.log(tarjetas.length);





console.log(tituloProducto.textContent);

const tituloDestacado = document.querySelector("#destacado");
tituloDestacado.textContent = "Camiseta TOP";
tituloDestacado.classList.add("Destacado");
tituloDestacado.classList.toggle("Oculto");

const li = document.createElement("li");
li.textContent = "New element";
document.querySelector("#listadesp"). appendChild(li);

tituloDestacado.setAttribute("title","mi lista");

//PARTE 2 
//CARRITO

const contador = document.querySelector("#counter");
//console.log(contador.textContent);
contador.textContent = "05";

//TALLAS
//const tallas = document.querySelector(".tallas button");
//console.log(tallas, tallas.length);
//tallaXS.setAttribute("aria-pressed",true);

// 1. Usamos querySelectorAll para obtener todos los botones en una lista
const tallas = document.querySelectorAll(".tallas button");

//
tallas.forEach((b) => {
    b.addEventListener("click", () => {
        // Obtenemos el estado actual del aria-pressed true, false o null
        const estaPresionado = b.getAttribute("aria-pressed") === "true";
        
        // Cambiamos al estado contrario 
        b.setAttribute("aria-pressed", !estaPresionado);
    });
});


//FILTROS
//document.querySelector(#filters).classlist.toggle("open");
