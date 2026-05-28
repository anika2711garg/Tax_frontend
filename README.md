# KoinX - Tax Loss Harvesting Tool

A high-fidelity, responsive React application built with **TypeScript** and **Vanilla CSS** replicating the premium capital gains tax-saving interfaces from the KoinX Figma designs.

---

## 🌟 Key Features

1. **Light & Dark Mode Synchronization:**
   - Smoothly toggle between the dark-mode dashboard (sleek deep blue glassmorphism) and the light-mode dashboard (clean, warm, modern gray borders) exactly matching the assignment screenshots.

2. **Real-time Tax Harvesting Math:**
   - Dynamic calculations of Short-Term and Long-Term Profits, Losses, Net Capital Gains, and Realised/Effective Capital Gains.
   - Shows an automated "You are going to save upto $ X" notification using micro-animations only if harvesting reduces overall tax liability.

3. **Pixel-Perfect Screen Replication (Figma Mock vs. Prompt API Toggles):**
   - **Figma Mock (Default):** Pre-selects Ethereum and overrides the holdings table with the exact numbers from the Figma design, ensuring an identical visual render (yielding exactly `$862` in savings and `$9,324.21` in ETH total current value).
   - **Prompt API:** Evaluates all gains, totals, and balances dynamically from the raw JSON payload and the 25-coin Holdings list, displaying proper calculations, search filters, and loaders.

4. **Web3 Interactive Table Checklist:**
   - Custom checkboxes to select/deselect individual assets or all coins at once in the header.
   - **"Amount to Sell"** column dynamically updates with the coin's balance when checked, showing a dashed placeholder when unchecked.
   - Live **Search bar** to filter assets by coin ticker (e.g., BTC, SOL) or name in real-time.
   - **Sorting:** Clickable headers sort alphabetically, by current price, current value, short-term gain, or long-term gain.
   - **"View all" Collapsible Footer Toggle:** Gracefully truncates the large holdings list (25+ items) showing a condensed list of the top 6, and expands to reveal all assets smoothly on click.

5. **Full Mobile Responsiveness:**
   - The card grid collapses to a single column on tablet/mobile screens.
   - Scrollable tables adapt properly with aligned text formatting for smaller mobile viewports.

---

## 🛠️ Tech Stack & Setup Instructions

* **Framework:** React 19 (TypeScript) via Vite
* **Styling:** Custom Vanilla CSS (Design variables, transitions, animations)
* **Iconography:** Lucide React

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **npm** installed.

### 2. Local Installation
In the project directory, run:

```bash
# 1. Install dependencies
npm install

# 2. Run local Vite development server
npm run dev
```

The server will launch locally, usually at: **`http://localhost:5173`**

### 3. Production Build
Verify code compilation and bundling correctness:

```bash
npm run build
```

This compiles optimized chunks under `/dist` in just a few seconds with **zero compilation warnings or errors**.

---

## 🧠 Core Assumptions & Mathematical Formulations

To deliver a pixel-perfect layout that aligns with the Figma designs, we reverse-engineered the mathematical ratios in the Figma screens:

1. **Crypto Tax Rates:**
   - We modeled the Indian tax standards for short-term and long-term crypto assets:
     - **Short-Term Capital Gains (STCG) Rate:** `30%`
     - **Long-Term Capital Gains (LTCG) Rate:** `11%` (10% + standard surcharges/cess)
   - *Resulting Formulation:* 
     $$\text{STCG Savings} = (\text{Pre STCG Net} - \text{Post STCG Net}) \times 0.30$$
     $$\text{LTCG Savings} = (\text{Pre LTCG Net} - \text{Post LTCG Net}) \times 0.11$$
     $$\text{Total Savings} = \text{STCG Savings} + \text{LTCG Savings}$$
   - When **Ethereum** is harvested:
     - STCG gains reduce by `$1,774` $\rightarrow$ saving `$532.20`
     - LTCG gains reduce by `$3,000` $\rightarrow$ saving `$330.00`
     - **Total savings matches exactly $862!** This aligns perfectly with the Figma screenshot.

2. **Holdings API Merging:**
   - To show the custom holdings table in the screenshots *and* the provided 25 holdings in the prompt, we merged the datasets. The screenshot coins (BTC, ETH, USDT, MATIC) load at the top of the table, while the prompt-provided tokens follow immediately below.
   - Using the **"View all"** collapsible footer allows the user to see the complete integrated list easily.

---

## 📂 Directory Structure

```
Tax_frontend/
├── dist/                     # Optimized production builds
├── src/
│   ├── components/
│   │   ├── Navbar.tsx        # Styled KoinX header with dataset & theme switch
│   │   ├── DisclaimerBox.tsx # Collapsible important notes banner
│   │   ├── GainsDashboard.tsx# Pre-harvesting and after-harvesting comparison cards
│   │   └── HoldingsTable.tsx # Searchable, sortable, expandable holdings table
│   ├── context/
│   │   └── TaxContext.tsx    # Global React state, calculations, and theme provider
│   ├── services/
│   │   └── api.ts            # Mock service serving both screenshot & prompt APIs
│   ├── App.css               # Cleared styles to avoid default boilerplate conflicts
│   ├── App.tsx               # Main component wrapping the application context
│   ├── index.css             # Unified CSS variable design tokens and glassmorphism styling
│   └── main.tsx              # Application entry point
├── package.json              # App dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project highlights and setup guide (This file)
```
