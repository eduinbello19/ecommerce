
package com.ecommerce.tienda.service;

import com.ecommerce.tienda.dto.LoginRequest;
import com.ecommerce.tienda.dto.LoginResponse;
import com.ecommerce.tienda.model.UsuarioModel;
import com.ecommerce.tienda.repository.UsuarioRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UsuarioService {

    private static final String MENSAJE_LOGIN = "Correo invalido o clave erronea vuelvalo a intentar";

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository u) {
        this.usuarioRepository = u;
    }

    // LISTAR TODOS LOS USUARIOS
    public List<UsuarioModel> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    // OBTENER USUARIO POR ID
    public UsuarioModel unUsuario(Integer id) {
        return usuarioRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "No se encontró el usuario"
            ));
    }

    // REGISTRAR USUARIO
    public UsuarioModel registrarUsuario(UsuarioModel usuario) {
        validarUsuario(usuario);
        return usuarioRepository.save(usuario);
    }

    // ELIMINAR USUARIO
    public void borrarUsuario(Integer id) {
        usuarioRepository.delete(unUsuario(id));
    }

    // MODIFICAR O ACTUALIZAR USUARIO
    public UsuarioModel modificarUsuario(Integer id, UsuarioModel usuario) {

        validarUsuario(usuario);

        UsuarioModel actualExistente = unUsuario(id);

        actualExistente.setNombre(usuario.getNombre());
        actualExistente.setApellido(usuario.getApellido());
        actualExistente.setCorreo(usuario.getCorreo());
        actualExistente.setDocumento(usuario.getDocumento());
        actualExistente.setClaveHash(usuario.getClaveHash());
        actualExistente.setCelular(usuario.getCelular());
        actualExistente.setTallaHabitual(usuario.getTallaHabitual());

        return usuarioRepository.save(actualExistente);
    }

    public LoginResponse autenticar(LoginRequest login) {
        if (login == null || login.correo() == null || login.correo().isBlank()
                || login.claveHash() == null || login.claveHash().isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, MENSAJE_LOGIN);
        }

        UsuarioModel usuario = usuarioRepository.findByCorreo(login.correo().trim())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, MENSAJE_LOGIN));

        if (!usuario.getClaveHash().equals(login.claveHash().trim())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, MENSAJE_LOGIN);
        }

        return new LoginResponse(
            usuario.getIdUsuario(),
            usuario.getCorreo(),
            usuario.getNombre()
        );
    }

    // VALIDAR USUARIO
    private void validarUsuario(UsuarioModel usuario) {

        if (usuario == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Los datos del usuario son obligatorios"
            );
        }

        if (usuario.getNombre() == null || usuario.getNombre().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El nombre del usuario es obligatorio"
            );
        }

        if (usuario.getApellido() == null || usuario.getApellido().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El apellido del usuario es obligatorio"
            );
        }

        if (usuario.getCorreo() == null || usuario.getCorreo().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El correo del usuario es obligatorio"
            );
        }

        if (usuario.getDocumento() == null || usuario.getDocumento().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El documento del usuario es obligatorio"
            );
        }

        if (usuario.getClaveHash() == null || usuario.getClaveHash().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "La clave del usuario es obligatoria"
            );
        }

        usuario.setNombre(usuario.getNombre().trim());
        usuario.setApellido(usuario.getApellido().trim());
        usuario.setCorreo(usuario.getCorreo().trim());
        usuario.setDocumento(usuario.getDocumento().trim());
        usuario.setClaveHash(usuario.getClaveHash().trim());
    }
}

