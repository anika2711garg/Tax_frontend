import React, { useState } from "react";
import { Info, ChevronDown, ChevronUp } from "lucide-react";

export const DisclaimerBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className={`disclaimer-panel ${isOpen ? "is-open" : "is-collapsed"}`}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="disclaimer-header">
        <div className="disclaimer-title">
          <span className="disclaimer-icon-wrap">
            <Info size={14} className="info-icon" />
          </span>
          <span>Important Notes And Disclaimers</span>
        </div>
        {isOpen ? <ChevronUp size={14} className="chevron-icon" /> : <ChevronDown size={14} className="chevron-icon" />}
      </button>

      {isOpen && (
        <div className="disclaimer-content animate-slide-down">
          <ul className="disclaimer-list">
            <li>
              <strong>Price Source Disclaimer:</strong> Please note that the current price of your coins may differ from
              the prices listed on specific exchanges. This is because we use CoinGecko as our default price source for
              certain exchanges, rather than fetching prices directly from the exchange.
            </li>
            <li>
              <strong>Country-specific Availability:</strong> Tax loss harvesting may not be supported in all countries.
              We strongly recommend consulting with your local tax advisor or accountant before performing any related
              actions on your exchange.
            </li>
            <li>
              <strong>Utilization of Losses:</strong> Tax loss harvesting typically allows you to offset capital gains.
              However, if you have zero or no applicable crypto capital gains, the usability of these harvested losses
              may be limited. Kindly confirm with your tax advisor how such losses can be applied in your situation.
            </li>
          </ul>
        </div>
      )}
    </section>
  );
};
