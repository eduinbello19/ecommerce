
package com.ecommerce.tienda.service;

import com.ecommerce.tienda.model.PagoModel;
import com.ecommerce.tienda.repository.PagoRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PagoService {

    private final PagoRepository pagoRepository;

    public PagoService(PagoRepository p) {
        this.pagoRepository = p;
    }

    // LISTAR TODOS LOS PAGOS
    public List<PagoModel> listarPagos() {
        return pagoRepository.findAll();
    }

    // OBTENER PAGO POR ID
    public PagoModel unPago(Integer id) {
        return pagoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "No se encontró el pago"
            ));
    }

    // REGISTRAR PAGO
    public PagoModel registrarPago(PagoModel pago) {
        validarPago(pago);
        return pagoRepository.save(pago);
    }

    // ELIMINAR PAGO
    public void borrarPago(Integer id) {
        pagoRepository.delete(unPago(id));
    }

    // MODIFICAR O ACTUALIZAR PAGO
    public PagoModel modificarPago(Integer id, PagoModel pago) {

        validarPago(pago);

        PagoModel actualExistente = unPago(id);

        actualExistente.setIdPedido(pago.getIdPedido());
        actualExistente.setMedio(pago.getMedio());
        actualExistente.setValor(pago.getValor());
        actualExistente.setFechaPago(pago.getFechaPago());

        return pagoRepository.save(actualExistente);
    }

    // VALIDAR PAGO
    private void validarPago(PagoModel pago) {

        if (pago == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Los datos del pago son obligatorios"
            );
        }

        if (pago.getIdPedido() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El ID del pedido es obligatorio"
            );
        }

        if (pago.getMedio() == null || pago.getMedio().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El medio de pago es obligatorio"
            );
        }

        if (pago.getValor() == null ||
            pago.getValor().compareTo(BigDecimal.ZERO) < 0) {

            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El valor del pago debe ser mayor o igual a cero"
            );
        }

        if (pago.getFechaPago() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "La fecha del pago es obligatoria"
            );
        }

        pago.setMedio(pago.getMedio().trim());
    }
}

