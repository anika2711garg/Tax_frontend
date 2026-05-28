# KoinX Tax Optimisation

React + TypeScript app for tax-loss harvesting, built to match the assignment UI and interactions.

## Features

- Dark/light theme toggle.
- Expanded disclaimer banner matching the screenshot style.
- `How it works?` popup.
- Pre-harvest vs after-harvest gains summary cards.
- Search, sort, select all, and per-row selection in the holdings table.
- Auto-Optimize action for loss-making assets.
- Export Plan CSV download.
- `View all` / `View less` toggle for the holdings list.
- Loader state while data is fetching.
- Error state if API data fails to load.
- Mobile-responsive layout.

## Bonus Coverage

These requested bonus items are present in the app:

- Mobile responsiveness.
- Clean, reusable components.
- Proper state management with `useContext`.
- Visual feedback for selections.
- Loader state for API calls.
- Error state for API calls.
- `View All` functionality in the holdings table.

## Self Innovation

- `Reset View` button to clear search, restore default sorting, and collapse the table.
- `Copy Summary` button to copy a quick selection summary to the clipboard.
- Inline API error banner with a retry action.

## Folder Structure

```text
Tax_frontend/
├── src/
│   ├── components/
│   ├── context/
│   ├── services/
│   ├── App.tsx
│   ├── App.css
│   └── index.css
├── public/
├── package.json
└── README.md
```

## Setup

```bash
npm install
npm run dev
```

The app runs on the Vite local server, usually at `http://localhost:5173`.

## Build

```bash
npm run build
```

## Screenshots

Add these in your submission before sharing the repo:

- Main dashboard with disclaimer banner.
- `How it works?` popup.
- Holdings table in collapsed and expanded `View all` states.
- Mobile view.

## Assumptions

- The app uses mock/local data sources wired through the existing context and service layer.
- The `View all` control shows the first 6 holdings by default and expands the list on demand.
- Screenshot text and formatting were prioritized over generic defaults.
- A live deployment link is not generated inside this workspace; publish the app separately on Vercel or Netlify.

## Validation

The app builds successfully with:

```bash
npm run build
```