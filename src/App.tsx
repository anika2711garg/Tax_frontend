import React from "react";
import { TaxProvider, useTax } from "./context/TaxContext";
import { Navbar } from "./components/Navbar";
import { GainsDashboard } from "./components/GainsDashboard";
import { HoldingsTable } from "./components/HoldingsTable";
import { DisclosurePopover } from "./components/DisclosurePopover";
import "./App.css";

const TaxHarvestingApp: React.FC = () => {
  const { theme } = useTax();

  return (
    <div className={`app-container ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
      <Navbar />

      <main className="main-content">
        <div className="content-container animate-fade-in-up">
          {/* Header Title with Link */}
          <div className="page-header-row">
            <h1 className="page-title">Tax Harvesting</h1>
            <DisclosurePopover
              variant="link"
              triggerAriaLabel="Open how it works popup"
              triggerContent="How it works?"
              align="left"
              items={[
                "See your capital gains for FY 2024-25 in the left card",
                "Check boxes for assets you plan on selling to reduce your tax liability",
                "Instantly see your updated tax liability in the right card"
              ]}
              note="Pro tip: Experiment with different combinations of your holdings to optimize your tax liability"
            />
          </div>

          <DisclosurePopover
            variant="banner"
            triggerAriaLabel="Open important notes and disclaimers popup"
            triggerContent="Important Notes And Disclaimers"
            align="left"
            items={[
              "Price Source Disclaimer: Please note that the current price of your coins may differ from the prices listed on specific exchanges. This is because we use CoinGecko as our default price source for certain exchanges, rather than fetching prices directly from the exchange.",
              "Country-specific Availability: Tax loss harvesting is not supported in all countries. We strongly recommend consulting with your local tax advisor or accountant before performing any related actions on your exchange.",
              "Utilization of Losses: Tax loss harvesting typically allows you to offset capital gains. However, if you have zero or no applicable crypto capital gains, the usability of these harvested losses may be limited. Kindly confirm with your tax advisor how such losses can be applied in your situation."
            ]}
          />

          {/* Capital Gains (Pre vs Post) Cards */}
          <GainsDashboard />

          {/* Checklist table of holdings */}
          <HoldingsTable />
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="app-footer">
        <p>© 2026 KoinX. Developed with extreme care for the Frontend Internship Assignment.</p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <TaxProvider>
      <TaxHarvestingApp />
    </TaxProvider>
  );
}

export default App;
