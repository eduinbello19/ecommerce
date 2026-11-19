
package com.ecommerce.tienda.controller;

import com.ecommerce.tienda.model.VarianteModel;
import com.ecommerce.tienda.service.VarianteService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/variante")
public class VarianteController {

    private final VarianteService varianteService;

    public VarianteController(VarianteService vs) {
        this.varianteService = vs;
    }

    // OBTENER TODAS LAS VARIANTES
    @GetMapping
    public List<VarianteModel> listar() {
        return varianteService.listarVariantes();
    }

    // OBTENER VARIANTE POR ID
    @GetMapping("/{id}")
    public VarianteModel mostrarVariante(@PathVariable Integer id) {
        return varianteService.unaVariante(id);
    }

    // REGISTRAR VARIANTE
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VarianteModel registrar(@RequestBody VarianteModel variante) {
        return varianteService.registrarVariante(variante);
    }

    // MODIFICAR O ACTUALIZAR VARIANTE
    @PutMapping("/{id}")
    public VarianteModel actualizar(
        @PathVariable Integer id,
        @RequestBody VarianteModel variante
    ) {
        return varianteService.modificarVariante(id, variante);
    }

    // ELIMINAR VARIANTE
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void suprimir(@PathVariable Integer id) {
        varianteService.borrarVariante(id);
    }
}

