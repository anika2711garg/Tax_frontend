import React from "react";
import { TaxProvider, useTax } from "./context/TaxContext";
import { Navbar } from "./components/Navbar";
import { DisclaimerBox } from "./components/DisclaimerBox";
import { GainsDashboard } from "./components/GainsDashboard";
import { HoldingsTable } from "./components/HoldingsTable";
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
            <a
              href="https://koinx.notion.site/Frontend-Intern-Job-Description-c7d7fa7b8ece435a8ee0f5507ddfd174"
              target="_blank"
              rel="noopener noreferrer"
              className="how-it-works-link"
            >
              How it works?
            </a>
          </div>

          {/* Notes & Disclaimers collapsible warning */}
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
