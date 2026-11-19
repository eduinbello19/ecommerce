
package com.ecommerce.tienda.model;

import jakarta.persistence.*;

@Entity
@Table(name = "direcciones")
public class DireccionModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_direccion")
    private Integer idDireccion;

    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(name = "ciudad", length = 100)
    private String ciudad;

    @Column(name = "codigo_postal", length = 20)
    private String codigoPostal;

    @Column(name = "direccion", length = 150)
    private String direccion;

    // Constructor vacío
    public DireccionModel() {
    }

    // Getter y Setter del ID
    public Integer getIdDireccion() {
        return idDireccion;
    }

    public void setIdDireccion(Integer idDireccion) {
        this.idDireccion = idDireccion;
    }

    // Getter y Setter del usuario
    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    // Getter y Setter de la ciudad
    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    // Getter y Setter del código postal
    public String getCodigoPostal() {
        return codigoPostal;
    }

    public void setCodigoPostal(String codigoPostal) {
        this.codigoPostal = codigoPostal;
    }

    // Getter y Setter de la dirección
    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
}

