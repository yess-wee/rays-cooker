package com.raysmakers.store;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class StoreApplicationTests {

    @Autowired
    MockMvc mvc;

    @Test
    void listsCatalogue() throws Exception {
        mvc.perform(get("/api/products")).andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(12));
        mvc.perform(get("/api/products?category=tasra-top")).andExpect(jsonPath("$.length()").value(2));
        mvc.perform(get("/api/recipes?kind=cooker")).andExpect(jsonPath("$.length()").value(4));
    }

    @Test
    void pricesOrderServerSide() throws Exception {
        String body = """
                {"items":[{"productId":"trinity","variant":"5.5 L","quantity":2}],
                 "paymentMethod":"card","coupon":"raysfest",
                 "customer":{"name":"Ananya Mehta","city":"Rajkot"}}""";
        mvc.perform(post("/api/orders").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.mrpTotal").value(7878))
                .andExpect(jsonPath("$.total").value(4726 - 250))
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
    }

    @Test
    void rejectsUnknownProduct() throws Exception {
        String body = """
                {"items":[{"productId":"nope","variant":"1 L","quantity":1}],"paymentMethod":"upi"}""";
        mvc.perform(post("/api/orders").contentType(MediaType.APPLICATION_JSON).content(body)).andExpect(status().isBadRequest());
    }
}
