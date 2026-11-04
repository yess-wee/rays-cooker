package com.raysmakers.store.controller;

import com.raysmakers.store.model.Order;
import com.raysmakers.store.model.OrderRequest;
import com.raysmakers.store.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orders;

    public OrderController(OrderService orders) {
        this.orders = orders;
    }

    /** Prices the bag server-side, runs the simulated payment and confirms the order. */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Order place(@Valid @RequestBody OrderRequest request) {
        return orders.place(request);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> get(@PathVariable String id) {
        return ResponseEntity.of(orders.find(id));
    }
}
