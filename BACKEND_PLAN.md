# PawPortrait Backend Plan

This prototype is static front-end only, but the data model is already separated in `app.js`.
The later backend can be built in small, realistic steps.

## Suggested Stack

- Frontend: current static HTML/CSS/JS, or later migrate to React/Vue if needed.
- Backend: Node.js + Express, because it is beginner-friendly and easy to deploy.
- Database: Firebase Firestore or MongoDB Atlas for quick setup; MySQL is also fine if the course requires relational tables.
- Storage: Firebase Storage, Aliyun OSS, or Tencent COS for uploaded pet photos and generated artwork.

## Core Tables / Collections

- `users`: name, phone, WeChat ID, city, createdAt.
- `pets`: userId, petName, petType, birthday, photoUrl.
- `styles`: styleId, name, promptTemplate, status.
- `products`: productId, name, price, factoryCostRange, supplierId, active.
- `artworks`: userId, petId, styleId, sourcePhotoUrl, generatedImageUrl, qualityScore, status.
- `orders`: userId, artworkId, productId, price, donationAmount, paymentStatus, fulfilmentStatus, trackingNumber.
- `donations`: orderId, amount, partnerOrg, settlementMonth, receiptUrl.
- `suppliers`: name, category, contact, leadTime, rating, backupRank.

## API Endpoints

- `GET /api/products`: list active products and prices.
- `GET /api/styles`: list available AI art styles.
- `POST /api/uploads/pet-photo`: upload image and return `photoUrl`.
- `POST /api/artworks/generate`: create AI artwork from `photoUrl` and `styleId`.
- `POST /api/orders`: create pending order after product selection.
- `POST /api/payments/wechat`: create WeChat Pay payment request.
- `PATCH /api/orders/:id/fulfilment`: update factory production and tracking status.
- `GET /api/impact/monthly`: return donation total, order count, and rescue story.

## AI Style Generation

The real art-style step should run on the backend, not directly in browser JavaScript.

Recommended flow:

1. Frontend uploads the pet photo to storage.
2. Backend receives `photoUrl` and `styleId`.
3. Backend maps `styleId` to a prompt template, such as cartoon, line art, oil painting, or realistic cleanup.
4. Backend calls an image editing / image-to-image API.
5. Backend saves the generated image and returns `generatedImageUrl`.
6. Frontend places `generatedImageUrl` into the product mockup print area.

Feasible API options:

- OpenAI Images API: good for image edit / transform workflows using an input image plus a prompt.
- Stability AI: common image-to-image option for style transfer and illustration variants.
- Replicate: useful if the team wants to try hosted open-source models without managing GPU servers.

For this student MVP, start with one provider only. OpenAI Images API is the simplest path if the team already has API experience; Replicate can be easier for experimenting with different visual models.

## MVP Implementation Order

1. Replace the arrays in `app.js` with `GET /api/products` and `GET /api/styles`.
2. Add image upload storage and save the returned `photoUrl`.
3. Add a fake order API first, storing selected style, product, price, and donation amount.
4. Add AI generation after the order flow works.
5. Add payment last; for class demo, keep payment as a simulated status change.

## Feasibility Notes

- The platform can start without inventory because every order is made on demand.
- The first backend does not need complex accounts; phone or WeChat ID can identify demo users.
- AI output can be simulated during early testing, then connected to a real image generation API later.
- Donation reporting is simple arithmetic at first: every paid order adds RMB 0.5.
