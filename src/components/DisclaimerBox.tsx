import React, { useState } from "react";
import { Info, ChevronDown, ChevronUp } from "lucide-react";

export const DisclaimerBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`disclaimer-box ${isOpen ? "open" : "collapsed"}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="disclaimer-header">
        <div className="disclaimer-title">
          <Info size={16} className="info-icon" />
          <span>Important Notes & Disclaimers</span>
        </div>
        <div className="disclaimer-toggle">
          {isOpen ? (
            <ChevronUp size={16} className="chevron-icon" />
          ) : (
            <ChevronDown size={16} className="chevron-icon" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="disclaimer-content animate-slide-down">
          <ul className="disclaimer-list">
            <li>
              Tax-loss harvesting is currently not allowed under Indian tax regulations. Please consult your tax advisor
              before making any decisions.
            </li>
            <li>
              Tax harvesting does not apply to derivatives or futures. These are handled separately as business income
              under tax rules.
            </li>
            <li>
              Price and market value data is fetched from Coingecko, not from individual exchanges. As a result, values
              may slightly differ from the ones on your exchange.
            </li>
            <li>
              Some countries do not have a short-term / long-term bifurcation. For now, we are calculating everything
              as long-term.
            </li>
            <li>Only realized losses are considered for harvesting. Unrealized losses in held assets are not counted.</li>
          </ul>
        </div>
      )}
    </div>
  );
};
