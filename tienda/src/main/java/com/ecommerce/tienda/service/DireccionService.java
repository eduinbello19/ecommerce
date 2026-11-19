
package com.ecommerce.tienda.service;

import com.ecommerce.tienda.model.DireccionModel;
import com.ecommerce.tienda.repository.DireccionRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class DireccionService {

    private final DireccionRepository direccionRepository;

    public DireccionService(DireccionRepository d) {
        this.direccionRepository = d;
    }

    // LISTAR TODAS LAS DIRECCIONES
    public List<DireccionModel> listarDirecciones() {
        return direccionRepository.findAll();
    }

    // OBTENER DIRECCION POR ID
    public DireccionModel unaDireccion(Integer id) {
        return direccionRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "No se encontró la dirección"
            ));
    }

    // REGISTRAR DIRECCION
    public DireccionModel registrarDireccion(DireccionModel direccion) {
        validarDireccion(direccion);
        return direccionRepository.save(direccion);
    }

    // ELIMINAR DIRECCION
    public void borrarDireccion(Integer id) {
        direccionRepository.delete(unaDireccion(id));
    }

    // MODIFICAR O ACTUALIZAR DIRECCION
    public DireccionModel modificarDireccion(Integer id, DireccionModel direccion) {

        validarDireccion(direccion);

        DireccionModel actualExistente = unaDireccion(id);

        actualExistente.setIdUsuario(direccion.getIdUsuario());
        actualExistente.setCiudad(direccion.getCiudad());
        actualExistente.setCodigoPostal(direccion.getCodigoPostal());
        actualExistente.setDireccion(direccion.getDireccion());

        return direccionRepository.save(actualExistente);
    }

    // VALIDAR DIRECCION
    private void validarDireccion(DireccionModel direccion) {

        if (direccion == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Los datos de la dirección son obligatorios"
            );
        }

        if (direccion.getIdUsuario() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El ID del usuario es obligatorio"
            );
        }

        if (direccion.getCiudad() == null || direccion.getCiudad().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "La ciudad es obligatoria"
            );
        }

        if (direccion.getDireccion() == null || direccion.getDireccion().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "La dirección es obligatoria"
            );
        }

        direccion.setCiudad(direccion.getCiudad().trim());
        direccion.setDireccion(direccion.getDireccion().trim());

        if (direccion.getCodigoPostal() != null) {
            direccion.setCodigoPostal(direccion.getCodigoPostal().trim());
        }
    }
}
