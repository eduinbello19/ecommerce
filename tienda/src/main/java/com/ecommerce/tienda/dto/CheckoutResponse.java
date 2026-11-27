package com.ecommerce.tienda.dto;

import java.math.BigDecimal;

public record CheckoutResponse(Integer idPedido, Integer idPago, Integer idDireccion, BigDecimal subtotal, BigDecimal costoEnvio, BigDecimal total, String estado, String medio) {
}
