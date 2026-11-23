
package com.ecommerce.tienda.model;

import jakarta.persistence.*;

@Entity
@Table(name = "variantes")
public class VarianteModel {

    @Id
    @Column(name = "id_variante")
    private Integer idVariante;

    @Column(name = "id_producto")
    private Integer idProducto;

    @Column(name = "talla", length = 10)
    private String talla;

    @Column(name = "color", length = 50)
    private String color;

    @Column(name = "stock")
    private Integer stock;

    // Constructor vacío
    public VarianteModel() {
    }

    // Getter y Setter del ID
    public Integer getIdVariante() {
        return idVariante;
    }

    public void setIdVariante(Integer idVariante) {
        this.idVariante = idVariante;
    }

    // Getter y Setter del producto
    public Integer getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Integer idProducto) {
        this.idProducto = idProducto;
    }

    // Getter y Setter de la talla
    public String getTalla() {
        return talla;
    }

    public void setTalla(String talla) {
        this.talla = talla;
    }

    // Getter y Setter del color
    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    // Getter y Setter del stock
    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }
}

