# ESCAPE - Weekend Trip Planner

## Project Overview

ESCAPE is a React web app for discovering Indian weekend destinations, building a Friday-to-Sunday itinerary, tracking the trip budget, and exporting a shareable PDF plan.

## Problem & Solution

Planning a short trip often means switching between destination searches, activity lists, maps, and budget notes. ESCAPE brings those steps into one focused workflow: explore destinations, filter by vibe and budget, save favorites, choose a destination, arrange activities by day, and review the total cost.

## Features

- Local account creation and login flow
- Destination discovery cards with images, descriptions, vibes, and daily budgets
- Search, vibe, and maximum-budget filtering
- Destination sorting by recommendation, budget, or name
- Save/favorite destinations and personalized recommendations
- Destination details modal with highlights and trip planning action
- Interactive Leaflet map with destination markers
- Friday, Saturday, and Sunday itinerary builder with drag-and-drop ordering
- Notes for planned activities
- Category budget breakdown and total budget summary
- PDF itinerary export
- Responsive layout for desktop and mobile screens

## Tech Stack

- React 19 and React Router
- Vite 8
- Zustand for trip state
- Tailwind CSS 4
- Leaflet and React Leaflet for maps
- jsPDF for PDF export
- Vitest and Testing Library for automated tests
- Oxlint for JavaScript and JSX linting

## Installation Steps

1. Install Node.js 18 or newer.
2. Clone the repository:

   ```bash
   git clone https://github.com/pawanmt02/TripPlanner.git
   cd TripPlanner
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Environment Configuration

The current app uses bundled destination data and browser `localStorage` for the demo authentication flow, so no environment variables are required for local development. For a future production backend, keep secrets in a local `.env` file and never commit that file.

## Run Commands

Start the development server:

```bash
npm run dev
```

Run the production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run the test suite:

```bash
npm test
```

Run linting:

```bash
npm run lint
```

## Deployment Information

The production output is generated in `dist/` with `npm run build`. The project can be deployed to Vercel, Netlify, GitHub Pages, or any static host configured for a Vite single-page application. Configure the host to serve `index.html` as the fallback for client-side routes such as `/explore` and `/planner`.

Repository: https://github.com/pawanmt02/TripPlanner

## Usage Instructions

1. Open the app and create an account or log in with an existing local account.
2. Use **Explore** to search destinations, choose a vibe, adjust the daily budget, and sort results.
3. Save destinations for later or open **Details** to inspect activities and highlights.
4. Select a destination to open the planner.
5. Add activities to Friday, Saturday, or Sunday, reorder them, and add notes.
6. Review the budget summary and select the PDF export action to download the itinerary.

## Screenshots / Demo

Run `npm run dev` and open `http://localhost:5173` to view the interactive demo. The main demo views are:

- Dashboard: trip overview and quick navigation
- Explore: destination cards, filters, recommendations, favorites, sorting, and map
- Planner: weekend itinerary builder, notes, map, budget summary, and PDF export

The repository contains the complete source for reproducing the demo locally.
