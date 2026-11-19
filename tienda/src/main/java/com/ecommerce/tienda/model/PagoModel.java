
package com.ecommerce.tienda.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagos")
public class PagoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pago")
    private Integer idPago;

    @Column(name = "id_pedido")
    private Integer idPedido;

    @Column(name = "medio")
    private String medio;

    @Column(name = "valor", precision = 12, scale = 0)
    private BigDecimal valor;

    @Column(name = "fecha_pago")
    private LocalDateTime fechaPago;

    // Constructor vacío
    public PagoModel() {
    }

    // Getter y Setter del ID
    public Integer getIdPago() {
        return idPago;
    }

    public void setIdPago(Integer idPago) {
        this.idPago = idPago;
    }

    // Getter y Setter del pedido
    public Integer getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(Integer idPedido) {
        this.idPedido = idPedido;
    }

    // Getter y Setter del medio
    public String getMedio() {
        return medio;
    }

    public void setMedio(String medio) {
        this.medio = medio;
    }

    // Getter y Setter del valor
    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    // Getter y Setter de la fecha
    public LocalDateTime getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(LocalDateTime fechaPago) {
        this.fechaPago = fechaPago;
    }
}

