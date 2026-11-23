
package com.ecommerce.tienda.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "productos")
public class ProductoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto")
    private Integer idProducto;

    @Column(name = "nombre", length = 150)
    private String nombre;

    @Column(name = "precio", precision = 12, scale = 2)
    private BigDecimal precio;

    @Column(name = "gramaje_gsm")
    private Integer gramajeGsm;

    @Column(name = "id_categoria")
    private Integer idCategoria;

    // NUEVA RUTA DE IMAGEN
    @Column(name = "ruta_imagen", length = 200)
    private String rutaImagen;

    // Constructor vacío
    public ProductoModel() {
    }

    // Getter y Setter del ID
    public Integer getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Integer idProducto) {
        this.idProducto = idProducto;
    }

    // Getter y Setter del nombre
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    // Getter y Setter del precio
    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    // Getter y Setter del gramaje
    public Integer getGramajeGsm() {
        return gramajeGsm;
    }

    public void setGramajeGsm(Integer gramajeGsm) {
        this.gramajeGsm = gramajeGsm;
    }

    // Getter y Setter de la categoría
    public Integer getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(Integer idCategoria) {
        this.idCategoria = idCategoria;
    }

    // Getter y Setter de la ruta de imagen
    public String getRutaImagen() {
        return rutaImagen;
    }

    public void setRutaImagen(String rutaImagen) {
        this.rutaImagen = rutaImagen;
    }
}
