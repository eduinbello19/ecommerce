
package com.ecommerce.tienda.repository;

import com.ecommerce.tienda.model.DetallePedidoModel;
import com.ecommerce.tienda.model.DetallePedidoId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DetallePedidoRepository extends JpaRepository<DetallePedidoModel, DetallePedidoId> {

}
