
package com.ecommerce.tienda.repository;

import com.ecommerce.tienda.model.VarianteModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VarianteRepository extends JpaRepository<VarianteModel, Integer> {

    VarianteModel findTopByOrderByIdVarianteDesc();

    @Modifying
    @Query("""
        UPDATE VarianteModel v
        SET v.stock = v.stock - :cantidad
        WHERE v.idVariante = :idVariante
          AND v.stock >= :cantidad
    """)
    int descontarStock(@Param("idVariante") Integer idVariante, @Param("cantidad") Integer cantidad);

}

