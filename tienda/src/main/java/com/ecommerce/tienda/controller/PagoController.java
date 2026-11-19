
package com.ecommerce.tienda.controller;

import com.ecommerce.tienda.model.PagoModel;
import com.ecommerce.tienda.service.PagoService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pago")
public class PagoController {

    private final PagoService pagoService;

    public PagoController(PagoService ps) {
        this.pagoService = ps;
    }

    // OBTENER TODOS LOS PAGOS
    @GetMapping
    public List<PagoModel> listar() {
        return pagoService.listarPagos();
    }

    // OBTENER PAGO POR ID
    @GetMapping("/{id}")
    public PagoModel mostrarPago(@PathVariable Integer id) {
        return pagoService.unPago(id);
    }

    // REGISTRAR PAGO
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PagoModel registrar(@RequestBody PagoModel pago) {
        return pagoService.registrarPago(pago);
    }

    // MODIFICAR O ACTUALIZAR PAGO
    @PutMapping("/{id}")
    public PagoModel actualizar(
        @PathVariable Integer id,
        @RequestBody PagoModel pago
    ) {
        return pagoService.modificarPago(id, pago);
    }

    // ELIMINAR PAGO
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void suprimir(@PathVariable Integer id) {
        pagoService.borrarPago(id);
    }
}

