
package com.ecommerce.tienda.controller;

import com.ecommerce.tienda.model.DetallePedidoModel;
import com.ecommerce.tienda.service.DetallePedidoService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/detalle-pedido")
public class DetallePedidoController {

    private final DetallePedidoService detallePedidoService;

    public DetallePedidoController(DetallePedidoService ds) {
        this.detallePedidoService = ds;
    }

    // OBTENER TODOS LOS DETALLES
    @GetMapping
    public List<DetallePedidoModel> listar() {
        return detallePedidoService.listarDetalles();
    }

    // OBTENER DETALLE POR LLAVE COMPUESTA
    @GetMapping("/{idPedido}/{idVariante}")
    public DetallePedidoModel mostrarDetalle(
        @PathVariable Integer idPedido,
        @PathVariable Integer idVariante
    ) {
        return detallePedidoService.unDetalle(idPedido, idVariante);
    }

    // REGISTRAR DETALLE
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DetallePedidoModel registrar(
        @RequestBody DetallePedidoModel detalle
    ) {
        return detallePedidoService.registrarDetalle(detalle);
    }

    // MODIFICAR O ACTUALIZAR DETALLE
    @PutMapping("/{idPedido}/{idVariante}")
    public DetallePedidoModel actualizar(
        @PathVariable Integer idPedido,
        @PathVariable Integer idVariante,
        @RequestBody DetallePedidoModel detalle
    ) {
        return detallePedidoService.modificarDetalle(
            idPedido,
            idVariante,
            detalle
        );
    }

    // ELIMINAR DETALLE
    @DeleteMapping("/{idPedido}/{idVariante}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void suprimir(
        @PathVariable Integer idPedido,
        @PathVariable Integer idVariante
    ) {
        detallePedidoService.borrarDetalle(idPedido, idVariante);
    }
}

