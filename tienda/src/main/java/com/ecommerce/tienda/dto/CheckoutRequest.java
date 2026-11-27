package com.ecommerce.tienda.dto;

import java.util.List;

public record CheckoutRequest(Integer idUsuario, List<CheckoutItemRequest> items, String direccion, String ciudad, String telefono, String medio) {
}
