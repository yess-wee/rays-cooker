package com.raysmakers.store.model;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record Order(
        String id,
        Instant placedAt,
        LocalDate estimatedDelivery,
        String status,
        String paymentMethod,
        String paymentReference,
        List<Item> items,
        int mrpTotal,
        int discount,
        int couponDiscount,
        int total,
        OrderRequest.Customer customer) {

    public record Item(String productId, String name, String variant, String image, int quantity, int mrp, int price) {
    }
}
