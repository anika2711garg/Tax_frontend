import React from "react";
import { TaxProvider, useTax } from "./context/TaxContext";
import { Navbar } from "./components/Navbar";
import { DisclaimerBox } from "./components/DisclaimerBox";
import { GainsDashboard } from "./components/GainsDashboard";
import { HoldingsTable } from "./components/HoldingsTable";
import { DisclosurePopover } from "./components/DisclosurePopover";
import "./App.css";

const TaxHarvestingApp: React.FC = () => {
  const { theme, error } = useTax();

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

          {error && (
            <div className="app-error-banner" role="alert">
              <div>
                <strong>Data sync failed.</strong>
                <span>{error}</span>
              </div>
              <button type="button" className="app-error-retry" onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          )}

          <DisclaimerBox />

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
