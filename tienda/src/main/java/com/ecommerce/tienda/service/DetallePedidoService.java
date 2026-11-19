
package com.ecommerce.tienda.service;

import com.ecommerce.tienda.model.DetallePedidoModel;
import com.ecommerce.tienda.model.DetallePedidoId;
import com.ecommerce.tienda.repository.DetallePedidoRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class DetallePedidoService {

    private final DetallePedidoRepository detallePedidoRepository;

    public DetallePedidoService(DetallePedidoRepository d) {
        this.detallePedidoRepository = d;
    }

    // LISTAR TODOS LOS DETALLES
    public List<DetallePedidoModel> listarDetalles() {
        return detallePedidoRepository.findAll();
    }

    // OBTENER DETALLE POR LLAVE COMPUESTA
    public DetallePedidoModel unDetalle(Integer idPedido, Integer idVariante) {

        DetallePedidoId id = new DetallePedidoId(idPedido, idVariante);

        return detallePedidoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "No se encontró el detalle del pedido"
            ));
    }

    // REGISTRAR DETALLE
    public DetallePedidoModel registrarDetalle(DetallePedidoModel detalle) {

        validarDetalle(detalle);

        DetallePedidoId id = new DetallePedidoId(
            detalle.getIdPedido(),
            detalle.getIdVariante()
        );

        if (detallePedidoRepository.existsById(id)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Esta variante ya está registrada en el pedido"
            );
        }

        return detallePedidoRepository.save(detalle);
    }

    // ELIMINAR DETALLE
    public void borrarDetalle(Integer idPedido, Integer idVariante) {
        detallePedidoRepository.delete(
            unDetalle(idPedido, idVariante)
        );
    }

    // MODIFICAR O ACTUALIZAR DETALLE
    public DetallePedidoModel modificarDetalle(
        Integer idPedido,
        Integer idVariante,
        DetallePedidoModel detalle
    ) {

        validarDetalle(detalle);

        DetallePedidoModel actualExistente = unDetalle(
            idPedido,
            idVariante
        );

        actualExistente.setCantidad(detalle.getCantidad());
        actualExistente.setPrecioUnitario(detalle.getPrecioUnitario());

        return detallePedidoRepository.save(actualExistente);
    }

    // VALIDAR DETALLE
    private void validarDetalle(DetallePedidoModel detalle) {

        if (detalle == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Los datos del detalle son obligatorios"
            );
        }

        if (detalle.getIdPedido() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El ID del pedido es obligatorio"
            );
        }

        if (detalle.getIdVariante() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El ID de la variante es obligatorio"
            );
        }

        if (detalle.getCantidad() == null || detalle.getCantidad() <= 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "La cantidad debe ser mayor que cero"
            );
        }

        if (detalle.getPrecioUnitario() == null ||
            detalle.getPrecioUnitario().compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El precio unitario debe ser mayor o igual a cero"
            );
        }
    }
}
