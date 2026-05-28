import React from "react";
import { useTax } from "../context/TaxContext";
import { Sparkles, Sliders, TrendingDown } from "lucide-react";

export const GainsDashboard: React.FC = () => {
  const {
    preHarvest,
    postHarvest,
    taxSavings,
    dataset,
    stcgTaxRate,
    ltcgTaxRate,
    setStcgTaxRate,
    setLtcgTaxRate
  } = useTax();

  // Custom formatting function to exactly match the screenshot spacing and symbols
  const formatValue = (val: number, isBig = false) => {
    const absVal = Math.abs(val);
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

  // Calculate percentage of tax reduction for the visual comparison chart
  const preTax = preHarvest.tax;
  const postTax = postHarvest.tax;
  const taxReductionPercent = preTax > 0 ? Math.max(0, Math.min(100, ((preTax - postTax) / preTax) * 100)) : 0;

  return (
    <div className="dashboard-wrapper">
      {/* 1. Tax Rate Controllers & Projection Chart (Extra Enhancements) */}
      <div className="projection-controls-panel">
        <div className="controls-header">
          <div className="controls-title-group">
            <Sliders size={16} className="icon-slider" />
            <span>Interactive Tax Calculator & Projections</span>
          </div>
          {taxSavings > 0 && (
            <div className="savings-alert-ticker animate-pulse">
              <TrendingDown size={14} />
              <span>Tax liability reduced by {taxReductionPercent.toFixed(0)}%!</span>
            </div>
          )}
        </div>

        <div className="controls-body">
          {/* Custom Tax Brackets Inputs */}
          <div className="tax-rates-inputs-group">
            <div className="rate-input-wrapper">
              <label htmlFor="stcg-rate" className="rate-label">STCG Tax Bracket:</label>
              <div className="input-suffix-wrapper">
                <input
                  id="stcg-rate"
                  type="number"
                  value={stcgTaxRate}
                  onChange={(e) => setStcgTaxRate(Number(e.target.value))}
                  className="rate-number-input"
                  min="0"
                  max="100"
                />
                <span className="percent-suffix">%</span>
              </div>
            </div>
            
            <div className="rate-input-wrapper">
              <label htmlFor="ltcg-rate" className="rate-label">LTCG Tax Bracket:</label>
              <div className="input-suffix-wrapper">
                <input
                  id="ltcg-rate"
                  type="number"
                  value={ltcgTaxRate}
                  onChange={(e) => setLtcgTaxRate(Number(e.target.value))}
                  className="rate-number-input"
                  min="0"
                  max="100"
                />
                <span className="percent-suffix">%</span>
              </div>
            </div>
          </div>

          {/* Custom Visual CSS Comparison Chart */}
          <div className="tax-comparison-chart-container">
            <div className="chart-bar-row">
              <div className="chart-bar-label">
                <span>Pre-Harvest Tax:</span>
                <span className="chart-bar-val font-semibold">{formatValue(preTax)}</span>
              </div>
              <div className="chart-bar-track">
                <div
                  className="chart-bar-fill pre-harvest-fill"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>

            <div className="chart-bar-row">
              <div className="chart-bar-label">
                <span>Post-Harvest Tax:</span>
                <span className="chart-bar-val font-semibold text-green">
                  {formatValue(postTax)}
                </span>
              </div>
              <div className="chart-bar-track">
                <div
                  className="chart-bar-fill post-harvest-fill animate-width-transition"
                  style={{ width: `${preTax > 0 ? (postTax / preTax) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Side-by-side gains display cards (Standard Requirement) */}
      <div className="gains-dashboard">
        {/* Pre Harvesting Card (Left - Dark Background) */}
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

        {/* After Harvesting Card (Right - Vibrant Blue Gradient) */}
        <div className="gains-card after-harvest-card animate-glow">
          <h3 className="card-header-title text-white">After Harvesting</h3>
          <div className="gains-table">
            <div className="gains-table-header text-white-muted">
              <span className="col-label"></span>
              <span className="col-val-header">Short-term</span>
              <span className="col-val-header">Long-term</span>
            </div>

            <div className="gains-row text-white">
              <span className="row-label text-white-muted">Profits</span>
              <span>{formatValue(postHarvest.stcg.profits)}</span>
              <span>{formatValue(postHarvest.ltcg.profits)}</span>
            </div>

            <div className="gains-row text-white">
              <span className="row-label text-white-muted">Losses</span>
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

          {/* Savings Badge */}
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
    </div>
  );
};
