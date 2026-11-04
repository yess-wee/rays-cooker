package com.raysmakers.store.service;

import com.raysmakers.store.model.Order;
import com.raysmakers.store.model.OrderRequest;
import com.raysmakers.store.model.Product;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Prices every order server-side and runs a simulated payment.
 * Orders live in memory: this is a concept store, no real money moves.
 */
@Service
public class OrderService {

    private static final Map<String, Integer> COUPONS = Map.of("RAYSFEST", 250);

    private final CatalogService catalog;
    private final Map<String, Order> orders = new ConcurrentHashMap<>();
    private final AtomicInteger sequence = new AtomicInteger(482913);

    public OrderService(CatalogService catalog) {
        this.catalog = catalog;
    }

    public Order place(OrderRequest request) {
        List<Order.Item> items = new ArrayList<>();
        for (OrderRequest.Line line : request.items()) {
            Product product = catalog.product(line.productId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown product " + line.productId()));
            Product.Variant variant = Optional.ofNullable(product.variant(line.variant()))
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown size " + line.variant()));
            items.add(new Order.Item(product.id(), product.name(), variant.label(), variant.image(),
                    line.quantity(), variant.mrp(), variant.price()));
        }
        int mrpTotal = items.stream().mapToInt(i -> i.mrp() * i.quantity()).sum();
        int subtotal = items.stream().mapToInt(i -> i.price() * i.quantity()).sum();
        String coupon = request.coupon() == null ? "" : request.coupon().trim().toUpperCase();
        int couponDiscount = Math.min(COUPONS.getOrDefault(coupon, 0), subtotal);

        Order order = new Order(
                "RYS-" + sequence.incrementAndGet(),
                Instant.now(),
                LocalDate.now().plusDays(4),
                "CONFIRMED",
                request.paymentMethod(),
                "SIM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                items,
                mrpTotal,
                mrpTotal - subtotal,
                couponDiscount,
                subtotal - couponDiscount,
                request.customer());
        orders.put(order.id(), order);
        return order;
    }

    public Optional<Order> find(String id) {
        return Optional.ofNullable(orders.get(id));
    }
}
