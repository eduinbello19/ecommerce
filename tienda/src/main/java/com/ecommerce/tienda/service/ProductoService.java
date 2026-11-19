
package com.ecommerce.tienda.service;

import com.ecommerce.tienda.model.ProductoModel;
import com.ecommerce.tienda.repository.ProductoRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository p) {
        this.productoRepository = p;
    }

    // LISTAR TODOS LOS PRODUCTOS
    public List<ProductoModel> listarProductos() {
        return productoRepository.findAll();
    }

    // OBTENER PRODUCTO POR ID
    public ProductoModel unProducto(Integer id) {
        return productoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "No se encontró el producto"
            ));
    }

    // REGISTRAR PRODUCTO
    public ProductoModel registrarProducto(ProductoModel producto) {
        validarProducto(producto);
        return productoRepository.save(producto);
    }

    // ELIMINAR PRODUCTO
    public void borrarProducto(Integer id) {
        productoRepository.delete(unProducto(id));
    }

    // MODIFICAR O ACTUALIZAR PRODUCTO
    public ProductoModel modificarProducto(Integer id, ProductoModel producto) {

        validarProducto(producto);

        ProductoModel actualExistente = unProducto(id);

        actualExistente.setNombre(producto.getNombre());
        actualExistente.setPrecio(producto.getPrecio());
        actualExistente.setGramajeGsm(producto.getGramajeGsm());
        actualExistente.setIdCategoria(producto.getIdCategoria());

        return productoRepository.save(actualExistente);
    }

    // VALIDAR PRODUCTO
    private void validarProducto(ProductoModel producto) {

        if (producto == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Los datos del producto son obligatorios"
            );
        }

        if (producto.getNombre() == null || producto.getNombre().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El nombre del producto es obligatorio"
            );
        }

        if (producto.getPrecio() == null ||
            producto.getPrecio().compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El precio debe ser mayor o igual a cero"
            );
        }

        if (producto.getGramajeGsm() == null ||
            producto.getGramajeGsm() < 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El gramaje debe ser mayor o igual a cero"
            );
        }

        if (producto.getIdCategoria() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El ID de la categoría es obligatorio"
            );
        }

        producto.setNombre(producto.getNombre().trim());
    }
}
