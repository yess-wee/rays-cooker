package com.raysmakers.store.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.raysmakers.store.model.Product;
import com.raysmakers.store.model.Recipe;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Optional;

/** Read-only catalogue loaded from the bundled JSON (MRPs from the 2026 RAYS price list). */
@Service
public class CatalogService {

    private final List<Product> products;
    private final List<Recipe> recipes;

    public CatalogService(ObjectMapper mapper) throws IOException {
        this.products = read(mapper, "data/products.json", new TypeReference<>() {});
        this.recipes = read(mapper, "data/recipes.json", new TypeReference<>() {});
    }

    private static <T> T read(ObjectMapper mapper, String path, TypeReference<T> type) throws IOException {
        try (InputStream in = new ClassPathResource(path).getInputStream()) {
            return mapper.readValue(in, type);
        }
    }

    public List<Product> products(String category) {
        if (category == null || category.isBlank() || category.equals("all")) return products;
        return products.stream().filter(p -> p.categories().contains(category)).toList();
    }

    public Optional<Product> product(String id) {
        return products.stream().filter(p -> p.id().equals(id)).findFirst();
    }

    public List<Recipe> recipes(String kind) {
        if (kind == null || kind.isBlank()) return recipes;
        return recipes.stream().filter(r -> r.kind().equals(kind)).toList();
    }

    public Optional<Recipe> recipe(String slug) {
        return recipes.stream().filter(r -> r.slug().equals(slug)).findFirst();
    }
}
