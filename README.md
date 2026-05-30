#NOTE
Since the backend has been hosted in free tier of render, First call can take 50 seconds or more to respond. Further calls shall be smooth. I apologise for inconvenience but I didn't know this before hosting. Thanks.
# CarsDekho Recommendation Frontend

A React + Vite + Tailwind frontend for a car recommendation take-home assignment.

The app helps buyers move from a vague requirement to a confident shortlist by combining a friendly recommendation form, inventory filters, car cards, and detail views backed by the recommendation APIs. The beauty of this application is that it was built without any human code, completely with the help of AI- ready and shipped in about an hour.

## Features

- First-visit recommendation modal with friendly prompts
- `POST /recommendation` integration showing top 3 matches
- Reasons to buy with green checks and tradeoffs with red crosses
- `GET /cars` inventory listing
- Filters for budget, mileage, seating capacity, transmission, and safety rating
- Hover-preview star selector for safety rating; results update only after click
- `GET /car?carId=...` detail modal for each car
- Downloaded car images stored by car ID in `public/car-images`
- Responsive, minimal UI built with Tailwind CSS

## Tech Stack

- React 19
- Vite
- Tailwind CSS v4
- ESLint
- AI
- Codex

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://your-backend-url
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run lint:

```bash
npm run lint
```

## Project Structure

```text
src/
  components/
    cars/
    filters/
    layout/
    recommendations/
  config/
    app.js
  services/
    carsApi.js
  App.jsx
```

Key files:

- `src/config/app.js` stores constants and reads `VITE_API_BASE_URL`.
- `src/services/carsApi.js` contains API calls.
- `src/components/filters/Filters.jsx` contains inventory filter UI.
- `src/components/recommendations/RecommendationDialog.jsx` contains the recommendation form and results.
- `public/car-images` stores downloaded images named by car ID, for example `car-001.jpg`.

## API Endpoints Used

- `GET /cars`
- `GET /car?carId=<id>`
- `POST /recommendation`

## Future Scope

- Add comparison mode for shortlisted cars
- Add sorting by price, mileage, safety, and recommendation score
- Persist shortlist across sessions
- Add richer car detail pages with reviews, pros, cons, and variant-level specs
- Add loading skeletons for recommendation results and car details
- Improve image accuracy by sourcing official model images or CDN-hosted assets
- Add tests for API services, filters, and recommendation rendering
- Add deployment config and environment-specific API URLs
