
package com.ecommerce.tienda.controller;

import com.ecommerce.tienda.model.CategoriaModel;
import com.ecommerce.tienda.service.CategoriaService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/categoria")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService cs) {
        this.categoriaService = cs;
    }
//OBTENCIÓN DE TODOS LOS ELEMENTOS//
    @GetMapping
    public List<CategoriaModel> listar() {
        return categoriaService.ListarCategoria();
    }
    
// OBTENCIÓN POR ID CON USO DE ENDPOINTS//

    @GetMapping("/{id}")
    public CategoriaModel mostrarCategoria(@PathVariable Integer id) {
        return categoriaService.unaCategoria(id);
    }

//REGISTRO DE CATEGORIA//
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoriaModel registrar(@RequestBody CategoriaModel cat){
        return categoriaService.registrarCategoria(cat);
    }
//MODIFICAR O ACTUALIZAR
    
    @PutMapping("/{id}")
    public CategoriaModel actualizar(@PathVariable Integer id,@RequestBody CategoriaModel cat){
        return categoriaService.modificarCategoria(id, cat);
    }
    
//ELIMINAR
    
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void suprimir(@PathVariable Integer id){
        categoriaService.borrarCategoria(id);
    }
}
