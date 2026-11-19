
package com.ecommerce.tienda.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class UsuarioModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(name = "nombre", length = 100)
    private String nombre;

    @Column(name = "apellido", length = 100)
    private String apellido;

    @Column(name = "correo", length = 150)
    private String correo;

    @Column(name = "documento", length = 20)
    private String documento;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(name = "clave_hash", length = 25)
    private String claveHash;

    @Column(name = "celular", length = 20)
    private String celular;

    @Column(name = "talla_habitual", length = 4)
    private String tallaHabitual;

    // Constructor vacío
    public UsuarioModel() {
    }

    // Getter y Setter del ID
    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    // Getter y Setter del nombre
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    // Getter y Setter del apellido
    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    // Getter y Setter del correo
    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    // Getter y Setter del documento
    public String getDocumento() {
        return documento;
    }

    public void setDocumento(String documento) {
        this.documento = documento;
    }

    // Getter y Setter de la clave
    public String getClaveHash() {
        return claveHash;
    }

    public void setClaveHash(String claveHash) {
        this.claveHash = claveHash;
    }

    // Getter y Setter del celular
    public String getCelular() {
        return celular;
    }

    public void setCelular(String celular) {
        this.celular = celular;
    }

    // Getter y Setter de la talla habitual
    public String getTallaHabitual() {
        return tallaHabitual;
    }

    public void setTallaHabitual(String tallaHabitual) {
        this.tallaHabitual = tallaHabitual;
    }
}
