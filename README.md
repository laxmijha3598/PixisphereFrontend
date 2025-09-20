# Pixisphere Frontend (React + Vite)

A lightweight React app (no Next.js) implementing:
- Category Listing page with cards, filters, sorting, search (debounced), and Load More
- Photographer Profile page with gallery, reviews, and an inquiry modal
- Uses Context API for state management and plain CSS for styling
- Data served via JSON Server from provided `db.json`

## Quick Start

Prerequisites: Node 18+, npm. For API: `json-server`.

```bash
# install deps
npm install

# run mock API (port 3001)
npm run serve:api

# in another terminal, run the dev server (port 5173)
npm run dev
```

Open `http://localhost:5173` in your browser.

## Mock API

- The JSON server watches `db.json` and exposes `GET http://localhost:3001/photographers`.
- Image paths in `db.json` point to `/images/...`. Place images in `public/images/` or rely on the included placeholder.

## Features

- Search by name, city, or tag, with 300ms debounce and basic fuzzy matching
- Filters: city, price range, minimum rating, styles (multi-select)
- Sorting: price (low to high), rating (high to low), recently added (by id)
- Responsive CSS, mobile-first breakpoints
- Skeleton loader and error/empty states
- Profile page with bio, tags/styles, gallery grid, reviews, and inquiry modal

## Notes on Logic

- Debounce: `setTimeout` in Context to derive `debouncedSearch`.
- Fuzzy search: simple in-order character match over `name`, `location`, and `tags`.
- Filtering & sorting are computed in memoized selectors inside Context. Pagination is a simple `visibleCount` with a "Load More" button.

## Folder Structure

```
/ (root)
  db.json
  public/images/
  src/
    context/PhotographersContext.jsx
    pages/CategoryPage.jsx
    pages/ProfilePage.jsx
    App.jsx
    main.jsx
    styles.css
```

## Build

```bash
npm run build
npm run preview
```

## Deploy

- Any static hosting (Netlify, Vercel static, S3) will work for the frontend.
- Ensure your JSON Server (port 3001) is reachable from the deployed frontend, or replace with a real API. For a self-contained local demo, run both locally as shown above.

## Screenshots (optional)

Add screenshots to `README` if desired.
# PixisphereFrontend
