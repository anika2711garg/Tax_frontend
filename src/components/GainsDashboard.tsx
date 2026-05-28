import React from "react";
import { useTax } from "../context/TaxContext";
import { Sparkles } from "lucide-react";

export const GainsDashboard: React.FC = () => {
  const { preHarvest, postHarvest, taxSavings, dataset } = useTax();

  // Custom formatting function to exactly match the screenshot spacing and symbols
  const formatValue = (val: number, isBig = false) => {
    const absVal = Math.abs(val);
    // Use integers for screenshot dataset, keep 2 decimals for prompt dataset
    const fractionDigits = dataset === "prompt" ? 2 : 0;
    const formatted = absVal.toLocaleString("en-US", {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits
    });

    if (val < 0) {
      return isBig ? `- $${formatted}` : `- $ ${formatted}`;
    }
    return `$ ${formatted}`;
  };

  return (
    <div className="gains-dashboard">
      {/* 1. Pre Harvesting Card (Left - Dark Background) */}
      <div className="gains-card pre-harvest-card">
        <h3 className="card-header-title">Pre Harvesting</h3>
        <div className="gains-table">
          <div className="gains-table-header">
            <span className="col-label"></span>
            <span className="col-val-header">Short-term</span>
            <span className="col-val-header">Long-term</span>
          </div>

          <div className="gains-row">
            <span className="row-label">Profits</span>
            <span className="row-val text-green">{formatValue(preHarvest.stcg.profits)}</span>
            <span className="row-val text-green">{formatValue(preHarvest.ltcg.profits)}</span>
          </div>

          <div className="gains-row">
            <span className="row-label">Losses</span>
            {/* Display losses as negative numbers just like the screenshot! */}
            <span className="row-val text-red">
              {preHarvest.stcg.losses > 0 ? formatValue(-preHarvest.stcg.losses) : formatValue(0)}
            </span>
            <span className="row-val text-red">
              {preHarvest.ltcg.losses > 0 ? formatValue(-preHarvest.ltcg.losses) : formatValue(0)}
            </span>
          </div>

          <div className="gains-row divider-top">
            <span className="row-label font-medium">Net Capital Gains</span>
            <span className={`row-val font-semibold ${preHarvest.stcg.net >= 0 ? "text-green" : "text-red"}`}>
              {formatValue(preHarvest.stcg.net)}
            </span>
            <span className={`row-val font-semibold ${preHarvest.ltcg.net >= 0 ? "text-green" : "text-red"}`}>
              {formatValue(preHarvest.ltcg.net)}
            </span>
          </div>
        </div>

        <div className="realised-gains-section">
          <span className="realised-label">Realised Capital Gains:</span>
          <span className={`realised-value ${preHarvest.realised >= 0 ? "text-green" : "text-red"}`}>
            {formatValue(preHarvest.realised, true)}
          </span>
        </div>
      </div>

      {/* 2. After Harvesting Card (Right - Vibrant Blue Gradient) */}
      <div className="gains-card after-harvest-card animate-glow">
        <h3 className="card-header-title text-white">After Harvesting</h3>
        <div className="gains-table">
          <div className="gains-table-header text-white-muted">
            <span className="col-label"></span>
            <span className="col-val-header">Short-term</span>
            <span className="col-val-header">Long-term</span>
          </div>

          <div className="gains-row text-white">
            <span className="row-label">Profits</span>
            <span>{formatValue(postHarvest.stcg.profits)}</span>
            <span>{formatValue(postHarvest.ltcg.profits)}</span>
          </div>

          <div className="gains-row text-white">
            <span className="row-label">Losses</span>
            {/* Render with exact negative signs */}
            <span>
              {postHarvest.stcg.losses > 0 ? formatValue(-postHarvest.stcg.losses) : formatValue(0)}
            </span>
            <span>
              {postHarvest.ltcg.losses > 0 ? formatValue(-postHarvest.ltcg.losses) : formatValue(0)}
            </span>
          </div>

          <div className="gains-row divider-top-white text-white">
            <span className="row-label font-medium">Net Capital Gains</span>
            <span className="font-semibold">{formatValue(postHarvest.stcg.net)}</span>
            <span className="font-semibold">{formatValue(postHarvest.ltcg.net)}</span>
          </div>
        </div>

        <div className="realised-gains-section text-white">
          <span className="realised-label">Effective Capital Gains:</span>
          <span className="realised-value font-bold">{formatValue(postHarvest.realised, true)}</span>
        </div>

        {/* Savings Tag with spark icons and animations */}
        {taxSavings > 0 && (
          <div className="savings-badge-container animate-bounce-subtle">
            <div className="savings-badge">
              <Sparkles size={16} className="sparkle-icon" />
              <span>
                You are going to save upto{" "}
                <strong className="savings-highlight">{formatValue(taxSavings, true)}</strong>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
