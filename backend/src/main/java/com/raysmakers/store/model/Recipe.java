package com.raysmakers.store.model;

import java.util.List;

public record Recipe(
        String slug,
        String name,
        String kind,
        String tag,
        String description,
        String time,
        int serves,
        String method,
        String image,
        List<String> ingredients,
        List<String> steps) {
}
