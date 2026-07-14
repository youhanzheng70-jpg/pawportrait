# PawPortrait

PawPortrait is an online custom pet artwork and product preview platform. Users upload a pet photo, choose an art style and product, optionally customize the artwork with stickers, generate a product mockup, and download the finished image before continuing to the PawPortrait Xiaohongshu shop.

## Current Experience

- Pet photo upload with an original-photo preview.
- Four AI art styles backed by reusable prompt templates.
- Five custom product options with reference prices.
- Downloadable AI artwork and optional sticker customization.
- A separate product-mockup generation stage.
- Final image download and handoff to the Xiaohongshu shop.

## Project Files

- `index.html`: customer-facing page structure.
- `styles.css`: responsive visual system and mobile layouts.
- `app.js`: front-end state and interaction flow.
- `server.js`: Express API for uploads, artwork generation, customization, and product mockups.
- `data/`: product, style, artwork, and customization records.

## Run Locally

Install dependencies:

```bash
npm install
```

Start the Express server:

```bash
npm start
```

Open:

```text
http://localhost:3000
```

Useful API checks:

```bash
curl -s http://localhost:3000/api/health
curl -s http://localhost:3000/api/products
curl -s http://localhost:3000/api/styles
```
