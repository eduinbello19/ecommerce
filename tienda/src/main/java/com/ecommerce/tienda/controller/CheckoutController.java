package com.ecommerce.tienda.controller;

import com.ecommerce.tienda.dto.CheckoutRequest;
import com.ecommerce.tienda.dto.CheckoutResponse;
import com.ecommerce.tienda.service.CheckoutService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService cs) {
        this.checkoutService = cs;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CheckoutResponse checkout(@RequestBody CheckoutRequest request) {
        return checkoutService.checkout(request);
    }
}
