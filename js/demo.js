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
const tallaXS = document.querySelector(".tallas button");
console.log(tallas, tallas.length);
tallaXS.setAttribute("aria-pressed",true);

//FILTROS
//document.querySelector(#filters).classlist.toggle("open");
