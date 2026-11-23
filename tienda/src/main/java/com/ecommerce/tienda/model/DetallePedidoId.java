
package com.ecommerce.tienda.model;

import java.io.Serializable;
import java.util.Objects;

public class DetallePedidoId implements Serializable {

    private Integer idPedido;
    private Integer idVariante;

    // Constructor vacío
    public DetallePedidoId() {
    }

    // Constructor con parámetros
    public DetallePedidoId(Integer idPedido, Integer idVariante) {
        this.idPedido = idPedido;
        this.idVariante = idVariante;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof DetallePedidoId)) return false;

        DetallePedidoId that = (DetallePedidoId) o;

        return Objects.equals(idPedido, that.idPedido)
            && Objects.equals(idVariante, that.idVariante);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idPedido, idVariante);
    }
}

