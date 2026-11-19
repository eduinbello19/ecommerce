
package com.ecommerce.tienda.repository;

import com.ecommerce.tienda.model.ProductoModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<ProductoModel, Integer> {

}
