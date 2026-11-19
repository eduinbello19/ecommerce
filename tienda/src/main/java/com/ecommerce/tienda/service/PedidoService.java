
package com.ecommerce.tienda.service;

import com.ecommerce.tienda.model.PedidoModel;
import com.ecommerce.tienda.repository.PedidoRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;

    public PedidoService(PedidoRepository p) {
        this.pedidoRepository = p;
    }

    // LISTAR TODOS LOS PEDIDOS
    public List<PedidoModel> listarPedidos() {
        return pedidoRepository.findAll();
    }

    // OBTENER PEDIDO POR ID
    public PedidoModel unPedido(Integer id) {
        return pedidoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "No se encontró el pedido"
            ));
    }

    // REGISTRAR PEDIDO
    public PedidoModel registrarPedido(PedidoModel pedido) {
        validarPedido(pedido);
        return pedidoRepository.save(pedido);
    }

    // ELIMINAR PEDIDO
    public void borrarPedido(Integer id) {
        pedidoRepository.delete(unPedido(id));
    }

    // MODIFICAR O ACTUALIZAR PEDIDO
    public PedidoModel modificarPedido(Integer id, PedidoModel pedido) {

        validarPedido(pedido);

        PedidoModel actualExistente = unPedido(id);

        actualExistente.setFecha(pedido.getFecha());
        actualExistente.setEstado(pedido.getEstado());
        actualExistente.setCostoEnvio(pedido.getCostoEnvio());
        actualExistente.setSubtotal(pedido.getSubtotal());
        actualExistente.setTotal(pedido.getTotal());
        actualExistente.setIdUsuario(pedido.getIdUsuario());
        actualExistente.setIdDireccion(pedido.getIdDireccion());

        return pedidoRepository.save(actualExistente);
    }

    // VALIDAR PEDIDO
    private void validarPedido(PedidoModel pedido) {

        if (pedido == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Los datos del pedido son obligatorios"
            );
        }

        if (pedido.getFecha() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "La fecha del pedido es obligatoria"
            );
        }

        if (pedido.getEstado() == null || pedido.getEstado().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El estado del pedido es obligatorio"
            );
        }

        if (pedido.getCostoEnvio() == null ||
            pedido.getCostoEnvio().compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El costo de envío debe ser mayor o igual a cero"
            );
        }

        if (pedido.getSubtotal() == null ||
            pedido.getSubtotal().compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El subtotal debe ser mayor o igual a cero"
            );
        }

        if (pedido.getTotal() == null ||
            pedido.getTotal().compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El total debe ser mayor o igual a cero"
            );
        }

        if (pedido.getIdUsuario() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El ID del usuario es obligatorio"
            );
        }

        if (pedido.getIdDireccion() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El ID de la dirección es obligatorio"
            );
        }

        pedido.setEstado(pedido.getEstado().trim());
    }
}

