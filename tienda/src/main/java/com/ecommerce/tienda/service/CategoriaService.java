
package com.ecommerce.tienda.service;

import com.ecommerce.tienda.model.CategoriaModel;
import com.ecommerce.tienda.repository.CategoriaRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class CategoriaService {
    
    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository c) {
        this.categoriaRepository = c;
    }
    
    public List<CategoriaModel> ListarCategoria(){
    return categoriaRepository.findAll();
    }
}
