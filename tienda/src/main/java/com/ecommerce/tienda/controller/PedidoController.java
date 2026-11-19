
package com.ecommerce.tienda.controller;

import com.ecommerce.tienda.model.PedidoModel;
import com.ecommerce.tienda.service.PedidoService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pedido")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService ps) {
        this.pedidoService = ps;
    }

    // OBTENER TODOS LOS PEDIDOS
    @GetMapping
    public List<PedidoModel> listar() {
        return pedidoService.listarPedidos();
    }

    // OBTENER PEDIDO POR ID
    @GetMapping("/{id}")
    public PedidoModel mostrarPedido(@PathVariable Integer id) {
        return pedidoService.unPedido(id);
    }

    // REGISTRAR PEDIDO
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PedidoModel registrar(@RequestBody PedidoModel pedido) {
        return pedidoService.registrarPedido(pedido);
    }

    // MODIFICAR O ACTUALIZAR PEDIDO
    @PutMapping("/{id}")
    public PedidoModel actualizar(
        @PathVariable Integer id,
        @RequestBody PedidoModel pedido
    ) {
        return pedidoService.modificarPedido(id, pedido);
    }

    // ELIMINAR PEDIDO
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void suprimir(@PathVariable Integer id) {
        pedidoService.borrarPedido(id);
    }
}

