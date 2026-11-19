
package com.ecommerce.tienda.controller;

import com.ecommerce.tienda.model.DireccionModel;
import com.ecommerce.tienda.service.DireccionService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/direccion")
public class DireccionController {

    private final DireccionService direccionService;

    public DireccionController(DireccionService ds) {
        this.direccionService = ds;
    }

    // OBTENER TODAS LAS DIRECCIONES
    @GetMapping
    public List<DireccionModel> listar() {
        return direccionService.listarDirecciones();
    }

    // OBTENER DIRECCION POR ID
    @GetMapping("/{id}")
    public DireccionModel mostrarDireccion(@PathVariable Integer id) {
        return direccionService.unaDireccion(id);
    }

    // REGISTRAR DIRECCION
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DireccionModel registrar(@RequestBody DireccionModel direccion) {
        return direccionService.registrarDireccion(direccion);
    }

    // MODIFICAR O ACTUALIZAR DIRECCION
    @PutMapping("/{id}")
    public DireccionModel actualizar(
        @PathVariable Integer id,
        @RequestBody DireccionModel direccion
    ) {
        return direccionService.modificarDireccion(id, direccion);
    }

    // ELIMINAR DIRECCION
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void suprimir(@PathVariable Integer id) {
        direccionService.borrarDireccion(id);
    }
}

