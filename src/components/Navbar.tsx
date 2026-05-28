import React from "react";
import { useTax } from "../context/TaxContext";
import { Sun, Moon, Database } from "lucide-react";

export const Navbar: React.FC = () => {
  const { theme, toggleTheme, dataset, changeDataset } = useTax();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Styled Logo matching KoinX brand */}
        <div className="navbar-brand">
          <svg
            width="120"
            height="32"
            viewBox="0 0 120 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="brand-logo-svg"
          >
            <text
              x="5"
              y="22"
              fill={theme === "dark" ? "#ffffff" : "#0f172a"}
              fontSize="20"
              fontWeight="800"
              fontFamily="'Outfit', sans-serif"
            >
              Koin
            </text>
            {/* Styled colored 'X' */}
            <path
              d="M54 9 L61 16 L54 23"
              stroke="#2563eb"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M62 9 L55 16 L62 23"
              stroke="#f97316"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="navbar-actions">
          {/* Dataset Selector Toggle */}
          <div className="dataset-selector-wrapper">
            <span className="dataset-label">
              <Database size={14} className="icon-db" />
              Source:
            </span>
            <button
              onClick={() => changeDataset("screenshot")}
              className={`dataset-btn ${dataset === "screenshot" ? "active" : ""}`}
              title="Show exact values from the Figma design"
            >
              Figma Mock
            </button>
            <button
              onClick={() => changeDataset("prompt")}
              className={`dataset-btn ${dataset === "prompt" ? "active" : ""}`}
              title="Show values from prompt Capital Gains JSON"
            >
              Prompt API
            </button>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label="Toggle theme"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? (
              <Sun size={20} className="theme-icon sun-icon animate-spin-slow" />
            ) : (
              <Moon size={20} className="theme-icon moon-icon animate-bounce-slow" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
