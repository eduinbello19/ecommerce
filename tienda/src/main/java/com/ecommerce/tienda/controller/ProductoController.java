
package com.ecommerce.tienda.controller;

import com.ecommerce.tienda.model.ProductoModel;
import com.ecommerce.tienda.service.ProductoService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/producto")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService ps) {
        this.productoService = ps;
    }

    // OBTENER TODOS LOS PRODUCTOS
    @GetMapping
    public List<ProductoModel> listar() {
        return productoService.listarProductos();
    }

    // OBTENER PRODUCTO POR ID
    @GetMapping("/{id}")
    public ProductoModel mostrarProducto(@PathVariable Integer id) {
        return productoService.unProducto(id);
    }

    // REGISTRAR PRODUCTO
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductoModel registrar(@RequestBody ProductoModel producto) {
        return productoService.registrarProducto(producto);
    }

    // MODIFICAR O ACTUALIZAR PRODUCTO
    @PutMapping("/{id}")
    public ProductoModel actualizar(
        @PathVariable Integer id,
        @RequestBody ProductoModel producto
    ) {
        return productoService.modificarProducto(id, producto);
    }

    // ELIMINAR PRODUCTO
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void suprimir(@PathVariable Integer id) {
        productoService.borrarProducto(id);
    }
}
