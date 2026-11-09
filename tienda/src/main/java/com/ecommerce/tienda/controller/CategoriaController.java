
package com.ecommerce.tienda.controller;

import com.ecommerce.tienda.model.CategoriaModel;
import com.ecommerce.tienda.service.CategoriaService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/categoria")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService cs) {
        this.categoriaService = cs;
    }

    @GetMapping
    public List<CategoriaModel> listar() {
        return categoriaService.ListarCategoria();
    }
}
