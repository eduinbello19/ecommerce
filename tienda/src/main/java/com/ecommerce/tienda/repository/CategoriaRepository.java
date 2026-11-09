/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.tienda.repository;

import com.ecommerce.tienda.model.CategoriaModel;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author Yesid
 */
public interface CategoriaRepository extends JpaRepository<CategoriaModel, Integer>{
    List<CategoriaModel> findByNombre(String texto);
            
}

