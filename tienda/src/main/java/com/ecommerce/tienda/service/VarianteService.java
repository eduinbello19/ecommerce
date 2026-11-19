
package com.ecommerce.tienda.service;

import com.ecommerce.tienda.model.VarianteModel;
import com.ecommerce.tienda.repository.VarianteRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class VarianteService {

    private final VarianteRepository varianteRepository;

    public VarianteService(VarianteRepository v) {
        this.varianteRepository = v;
    }

    // LISTAR TODAS LAS VARIANTES
    public List<VarianteModel> listarVariantes() {
        return varianteRepository.findAll();
    }

    // OBTENER VARIANTE POR ID
    public VarianteModel unaVariante(Integer id) {
        return varianteRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "No se encontró la variante"
            ));
    }

    // REGISTRAR VARIANTE
    public VarianteModel registrarVariante(VarianteModel variante) {
        validarVariante(variante);
        return varianteRepository.save(variante);
    }

    // ELIMINAR VARIANTE
    public void borrarVariante(Integer id) {
        varianteRepository.delete(unaVariante(id));
    }

    // MODIFICAR O ACTUALIZAR VARIANTE
    public VarianteModel modificarVariante(Integer id, VarianteModel variante) {

        validarVariante(variante);

        VarianteModel actualExistente = unaVariante(id);

        actualExistente.setIdProducto(variante.getIdProducto());
        actualExistente.setTalla(variante.getTalla());
        actualExistente.setColor(variante.getColor());
        actualExistente.setStock(variante.getStock());

        return varianteRepository.save(actualExistente);
    }

    // VALIDAR VARIANTE
    private void validarVariante(VarianteModel variante) {

        if (variante == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Los datos de la variante son obligatorios"
            );
        }

        if (variante.getIdProducto() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El ID del producto es obligatorio"
            );
        }

        if (variante.getTalla() == null || variante.getTalla().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "La talla es obligatoria"
            );
        }

        if (variante.getColor() == null || variante.getColor().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El color es obligatorio"
            );
        }

        if (variante.getStock() == null || variante.getStock() < 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El stock debe ser mayor o igual a cero"
            );
        }

        variante.setTalla(variante.getTalla().trim());
        variante.setColor(variante.getColor().trim());
    }
}
