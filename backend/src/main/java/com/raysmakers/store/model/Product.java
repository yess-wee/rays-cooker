package com.raysmakers.store.model;

import java.util.List;

public record Product(
        String id,
        String name,
        String shortName,
        List<String> categories,
        String line,
        int warrantyYears,
        String kind,
        double rating,
        int reviews,
        boolean isNew,
        String description,
        int defaultVariant,
        String altImage,
        List<Variant> variants) {

    public record Variant(String label, int mrp, String image) {
        /** Festive edit: flat 40% off MRP. */
        public int price() {
            return Math.round(mrp * 0.6f);
        }
    }

    public Variant variant(String label) {
        return variants.stream().filter(v -> v.label().equals(label)).findFirst().orElse(null);
    }
}
