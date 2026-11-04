package com.raysmakers.store.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record OrderRequest(
        @NotEmpty @Valid List<Line> items,
        @Valid Customer customer,
        @NotBlank String paymentMethod,
        String coupon) {

    public record Line(@NotBlank String productId, @NotBlank String variant, @Min(1) int quantity) {
    }

    public record Customer(String name, String phone, String email, String address, String city, String pin) {
    }
}
