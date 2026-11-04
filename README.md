# RAYS — D2C Store Concept

A premium direct-to-consumer storefront concept for **Rays Makers Pvt. Ltd.** (RAYS · *Best Never Lies*) — Triply pressure cookers, Tasra & Top, Hard Anodised, Aluminium and Roti Tawa.

🎬 **Walkthrough film:** [`docs/RAYS-Store-Film.mp4`](docs/RAYS-Store-Film.mp4) — device intro → full shopping journey → outro (2:41, 1080p).

| Layer | Stack |
|---|---|
| `frontend/` | React 18 · Vite 5 · React Router 6 · plain CSS (no UI kit) |
| `backend/` | Spring Boot 3.3 · Java 17 · Maven (wrapper included) |

## Features

- **Cinematic intro** — masked logo reveal and a five-column curtain, then an editorial hero with line-by-line headline reveals, a framed product unveil with a light sweep and mouse parallax.
- **Catalogue** — 12 product families / 40+ sizes with MRPs from the 2026 RAYS price list and the 40% festive edit; instant category filters.
- **Product page** — View-Transition image morph from the card, live size & price switching, hover zoom, fly-to-bag animation.
- **Recipes per product** — every cooker, tasra, top and tawa ships with chef-tested recipes (real food photography) opened in an editorial modal.
- **Bag** — live totals, savings and a free-gift progress bar.
- **Checkout** — floating-label address form, UPI / card (live 3-D card preview) / net banking / COD, coupon `RAYSFEST`.
- **Simulated payment** — the order is priced **server-side** by Spring Boot and confirmed with an order number and delivery timeline. No real money moves.

## Run locally

Prerequisites: **Java 17+** and **Node 18+**.

```bash
# 1. API → http://localhost:8080
cd backend
./mvnw spring-boot:run          # Windows: mvnw.cmd spring-boot:run

# 2. Storefront → http://localhost:5173 (proxies /api to :8080)
cd frontend
npm install
npm run dev
```

The storefront also runs on its own: if the API is down it falls back to the bundled catalogue and prices orders locally.

## API

| Method | Path | Description |
|---|---|---|
| GET | `/api/products?category=` | Catalogue (`cookers`, `triply`, `tasra-top`, `combos`, `anodised`, `aluminium`, `tawa`) |
| GET | `/api/products/{id}` | One product family with its sizes |
| GET | `/api/recipes?kind=` | Recipes (`cooker`, `tasra`, `top`, `tawa`) |
| GET | `/api/recipes/{slug}` | One recipe |
| POST | `/api/orders` | Price the bag, run the simulated payment, confirm the order |
| GET | `/api/orders/{id}` | Fetch a placed order |

```json
POST /api/orders
{
  "items": [{ "productId": "trinity", "variant": "5.5 L", "quantity": 1 }],
  "customer": { "name": "Ananya Mehta", "city": "Rajkot" },
  "paymentMethod": "card",
  "coupon": "RAYSFEST"
}
```

Tests: `cd backend && ./mvnw test`

## Project layout

```
backend/
  src/main/java/com/raysmakers/store/
    controller/   CatalogController, OrderController
    service/      CatalogService (JSON catalogue), OrderService (server-side pricing, simulated payment)
    model/        Product, Recipe, Order, OrderRequest
    config/       WebConfig (CORS)
  src/main/resources/data/   products.json, recipes.json
frontend/
  src/pages/        Home, Shop, Product, Checkout, Success
  src/components/   Loader, Header, Footer, Cards, Overlays (bag, recipe modal, toast)
  src/context/      StoreContext (catalogue, bag, navigation with View Transitions)
  public/assets/    product photography + food/
docs/               walkthrough film
```

## Notes

- Concept build: payments are simulated and orders are kept in memory.
- Brass, Hard Anodised, Aluminium and Tawa prices are placeholders to confirm with the client.
- Food photography: Wikimedia Commons contributors (CC BY / CC BY-SA).
