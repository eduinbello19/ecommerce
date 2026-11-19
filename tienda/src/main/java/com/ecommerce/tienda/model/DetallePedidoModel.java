
package com.ecommerce.tienda.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "detalle_pedido")
@IdClass(DetallePedidoId.class)
public class DetallePedidoModel {

    @Id
    @Column(name = "id_pedido")
    private Integer idPedido;

    @Id
    @Column(name = "id_variante")
    private Integer idVariante;

    @Column(name = "cantidad")
    private Integer cantidad;

    @Column(name = "precio_unitario", precision = 12, scale = 2)
    private BigDecimal precioUnitario;

    // Constructor vacío
    public DetallePedidoModel() {
    }

    // Getter y Setter del pedido
    public Integer getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(Integer idPedido) {
        this.idPedido = idPedido;
    }

    // Getter y Setter de la variante
    public Integer getIdVariante() {
        return idVariante;
    }

    public void setIdVariante(Integer idVariante) {
        this.idVariante = idVariante;
    }

    // Getter y Setter de la cantidad
    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    // Getter y Setter del precio unitario
    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(BigDecimal precioUnitario) {
        this.precioUnitario = precioUnitario;
    }
}
