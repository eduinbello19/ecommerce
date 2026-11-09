//arreglo con 5 camisetas//
const camisetas = [
    {
        id: 1,
        nombre: "Camiseta negra estampada",
        precio: 50000,
        variantes: [
            { id: 101, talla: "S", color: "Negro", stock: 8 },
            { id: 102, talla: "M", color: "Negro", stock: 15 },
            { id: 103, talla: "L", color: "Negro", stock: 10 },
            { id: 104, talla: "XL", color: "Negro", stock: 0 }
        ] 
    },
    {
        id: 2,
        nombre: "Camiseta blanca oversize",
        precio: 60000,
        variantes: [
            { id: 201, talla: "S", color: "Blanco", stock: 12 },
            { id: 202, talla: "M", color: "Blanco", stock: 18 },
            { id: 203, talla: "L", color: "Blanco", stock: 14 },
            { id: 204, talla: "XL", color: "Blanco", stock: 7 }
        ]
    },
    {
        id: 3,
        nombre: "Camiseta handsmade tail",
        precio: 45000,
        variantes: [
            { id: 301, talla: "S", color: "Rojo", stock: 6 },
            { id: 302, talla: "M", color: "Rojo", stock: 11 },
            { id: 303, talla: "L", color: "Rojo", stock: 9 },
            { id: 304, talla: "XL", color: "Rojo", stock: 4 }
        ]
    },
    {
        id: 4,
        nombre: "Camiseta bender",
        precio: 35000,
        variantes: [
            { id: 401, talla: "S", color: "Gris", stock: 20 },
            { id: 402, talla: "M", color: "Gris", stock: 16 },
            { id: 403, talla: "L", color: "Gris", stock: 12 },
            { id: 404, talla: "XL", color: "Gris", stock: 8 }
        ]
    },
    {
        id: 5,
        nombre: "Camiseta negra oversize",
        precio: 55000,
        variantes: [
            { id: 501, talla: "S", color: "Negro", stock: 10 },
            { id: 502, talla: "M", color: "Negro", stock: 13 },
            { id: 503, talla: "L", color: "Negro", stock: 17 },
            { id: 504, talla: "XL", color: "Negro", stock: 0 }
        ]
    }
];

// Filtro de camisetas por talla y color
function filtrarCamisetas(talla, color) {

    return camisetas.filter(camiseta =>
        camiseta.variantes.some(variante =>
            variante.talla === talla &&
            variante.color === color &&
            variante.stock > 0
        )
    );

}
//filtro especifico e interactivo ;

const talla = "S";
const color = "Blanco";

const resultado = filtrarCamisetas(talla, color);

if (resultado.length > 0) {

    resultado.forEach(camiseta => {

        const varianteEncontrada = camiseta.variantes.find(variante =>
            variante.talla === talla &&
            variante.color === color &&
            variante.stock > 0
        );

        console.log(
            `Para tu búsqueda de camisetas de color ${color} y talla ${talla}, quedan ${varianteEncontrada.stock} unidades disponibles en el modelo ${camiseta.nombre}.`
        );

    });

} else {
    console.log(`No hay camisetas de color ${color} y talla ${talla} disponibles.`);
}

// Función para calcular el total de la compra "carrito"//


let carrito = [];

// Agregar productos de prueba al carrito

carrito.push(
    {
        id: 401,
        nombre: "Camiseta bender",
        talla: "S",
        cantidad: 1,
        precio: 35000
    },
    {
        id: 402,
        nombre: "Camiseta bender",
        talla: "M",
        cantidad: 1,
        precio: 35000
    },
    {
        id: 304,
        nombre: "Camiseta handsmade tail",
        talla: "XL",
        cantidad: 2,
        precio: 45000
    }
);

//funcion para calcular el total 

function calcularTotal(lista) {

    const total = lista.reduce((acumulador, camiseta) => {
        return acumulador + (camiseta.precio * camiseta.cantidad);
    }, 0);

// Mostrar cada producto seleccionado
    console.log("RESUMEN DE TU COMPRA:");

    lista.forEach(camiseta => {

        const subtotal = camiseta.precio * camiseta.cantidad;

        console.log(
            `${camiseta.nombre} | Talla: ${camiseta.talla} | Cantidad: ${camiseta.cantidad} | Precio unitario: $${camiseta.precio.toLocaleString("es-CO")} | Subtotal: $${subtotal.toLocaleString("es-CO")}`
        );

    });

    console.log(
        `El total por las prendas seleccionadas es de $${total.toLocaleString("es-CO")}`
    );

    return total;
}

//ejecutar funcion

calcularTotal(carrito);


//pruebas con console.log
console.log("Todas las camisetas:", camisetas);

console.log("Camisetas filtradas:", filtrarCamisetas("S", "Blanco"));
