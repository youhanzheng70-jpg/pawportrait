# PawPortrait Website Prototype

Static front-end prototype for the May 1 graduation project submission.

Open `index.html` in a browser to present the demo.

## What It Shows

- Brand and business concept for PawPortrait.
- Four-step user flow: upload pet photo, choose AI style, choose product, confirm demo order.
- MVP product catalogue with pricing and margin logic from the proposal.
- Caring Paw Print charity impact section.
- Backend roadmap and feasible database/API plan in `BACKEND_PLAN.md`.

## Files

- `index.html`: page structure and prototype sections.
- `styles.css`: responsive visual design and product mockups.
- `app.js`: front-end state, mock product/style data, upload preview, demo order logic.
- `BACKEND_PLAN.md`: realistic next-step backend structure for the team.

## Local Backend

Install dependencies:

```bash
npm install
```

Start the Express backend:

```bash
npm start
```

Open the site through the backend:

```text
http://localhost:3000
```

Useful API checks:

```bash
curl -s http://localhost:3000/api/health
curl -s http://localhost:3000/api/products
curl -s http://localhost:3000/api/styles
```
