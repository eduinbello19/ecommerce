
package com.ecommerce.tienda.controller;

import com.ecommerce.tienda.dto.LoginRequest;
import com.ecommerce.tienda.model.UsuarioModel;
import com.ecommerce.tienda.service.UsuarioService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService us) {
        this.usuarioService = us;
    }

    // OBTENER TODOS LOS USUARIOS
    @GetMapping
    public List<UsuarioModel> listar() {
        return usuarioService.listarUsuarios();
    }

    // OBTENER USUARIO POR ID
    @GetMapping("/{id}")
    public UsuarioModel mostrarUsuario(@PathVariable Integer id) {
        return usuarioService.unUsuario(id);
    }

    // REGISTRAR USUARIO
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioModel registrar(@RequestBody UsuarioModel usuario) {
        return usuarioService.registrarUsuario(usuario);
    }

    @PostMapping("/login")
    public void login(@RequestBody LoginRequest login) {
        usuarioService.autenticar(login);
    }

    // MODIFICAR O ACTUALIZAR USUARIO
    @PutMapping("/{id}")
    public UsuarioModel actualizar(
        @PathVariable Integer id,
        @RequestBody UsuarioModel usuario
    ) {
        return usuarioService.modificarUsuario(id, usuario);
    }

    // ELIMINAR USUARIO
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void suprimir(@PathVariable Integer id) {
        usuarioService.borrarUsuario(id);
    }
}
