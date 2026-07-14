# PawPortrait Backend Architecture

PawPortrait uses a lightweight Node.js and Express backend to support the online design experience. Transactions, payment, order records, and after-sales service are handled through the PawPortrait Xiaohongshu shop.

## Current Responsibilities

- Serve the customer-facing website and product assets.
- Return the active product and art-style catalogues.
- Validate and store uploaded pet photos.
- Generate pet artwork from an uploaded image and selected style.
- Save optional sticker customizations as flattened artwork.
- Generate a product mockup from the approved artwork and blank product reference image.
- Return downloadable image URLs to the customer-facing interface.

## Active API Endpoints

- `GET /api/health`: confirm service availability.
- `GET /api/products`: list active products and reference prices.
- `GET /api/styles`: list available AI art styles.
- `POST /api/uploads/pet-photo`: upload a pet image and return its URL.
- `POST /api/artworks/generate`: create artwork from a photo and style.
- `POST /api/artworks/customize`: save sticker edits and export the flattened image.
- `POST /api/product-mockups/generate`: apply approved artwork to a selected product.

## Image Generation Flow

1. The customer uploads a pet photo.
2. The backend combines the selected style prompt with the uploaded image.
3. The generated artwork is returned for review, download, or optional sticker editing.
4. The approved artwork and blank product reference image are used to create the product mockup.
5. The customer downloads the final image and continues to the Xiaohongshu shop.

## Deployment Notes

- Keep the OpenAI API key on the server through environment variables.
- Store generated assets in persistent object storage before scaling traffic.
- Treat product mockups as visual previews rather than manufacturing proofs.
- Keep payment and order fulfillment outside this service while Xiaohongshu remains the transaction channel.
