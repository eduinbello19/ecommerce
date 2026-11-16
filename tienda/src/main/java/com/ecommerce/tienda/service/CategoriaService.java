
package com.ecommerce.tienda.service;

import com.ecommerce.tienda.model.CategoriaModel;
import com.ecommerce.tienda.repository.CategoriaRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CategoriaService {
    
    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository c) {
        this.categoriaRepository = c;
    }
    //LISTAR TODOS LOS ELEMENTOS
    
    public List<CategoriaModel> ListarCategoria(){
    return categoriaRepository.findAll();
    }
    
    // OBTENCIÓN POR ID //

    public CategoriaModel unaCategoria(Integer id) {
    return categoriaRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND,
            "No se encontró la categoría"
        ));
    }
    
    //REGISTRO DE CATEGORIA//
    public CategoriaModel registrarCategoria (CategoriaModel cat){
        return categoriaRepository.save(cat);
    }
    
    //ELIMINAR
    
    public void borrarCategoria(Integer id){
        categoriaRepository.delete(unaCategoria(id));
    }

    //MODIFICAR O ACTUALIZAR
    public CategoriaModel modificarCategoria(Integer id, CategoriaModel cat){
        validarCategoria(cat);
        CategoriaModel actualoExistente = unaCategoria(id);
        actualoExistente.setNombre(cat.getNombre());
        actualoExistente.setDescripcion(cat.getDescripcion());
        
        return categoriaRepository.save(actualoExistente);
    }
    
    //VALIDAR CATEGORIA
    private void validarCategoria(CategoriaModel cat){
        if (cat == null || cat.getNombre() ==null || cat.getNombre().isBlank()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Nombre de la categoria es obligatorio");
        }
cat.setNombre(cat.getNombre().trim());
    }
}
