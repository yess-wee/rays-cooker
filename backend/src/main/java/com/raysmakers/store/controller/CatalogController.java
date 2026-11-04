package com.raysmakers.store.controller;

import com.raysmakers.store.model.Product;
import com.raysmakers.store.model.Recipe;
import com.raysmakers.store.service.CatalogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CatalogController {

    private final CatalogService catalog;

    public CatalogController(CatalogService catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/products")
    public List<Product> products(@RequestParam(required = false) String category) {
        return catalog.products(category);
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> product(@PathVariable String id) {
        return ResponseEntity.of(catalog.product(id));
    }

    @GetMapping("/recipes")
    public List<Recipe> recipes(@RequestParam(required = false) String kind) {
        return catalog.recipes(kind);
    }

    @GetMapping("/recipes/{slug}")
    public ResponseEntity<Recipe> recipe(@PathVariable String slug) {
        return ResponseEntity.of(catalog.recipe(slug));
    }
}
