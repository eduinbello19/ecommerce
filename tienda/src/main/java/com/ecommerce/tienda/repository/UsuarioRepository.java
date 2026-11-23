
package com.ecommerce.tienda.repository;

import com.ecommerce.tienda.model.UsuarioModel;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<UsuarioModel, Integer> {

    Optional<UsuarioModel> findByCorreo(String correo);

}

