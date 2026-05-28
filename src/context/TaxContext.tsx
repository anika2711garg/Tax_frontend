import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type {
  Holding,
  CapitalGains
} from "../services/api";
import {
  fetchCapitalGains,
  fetchHoldings,
  SCREENSHOT_CAPITAL_GAINS
} from "../services/api";

export interface TaxContextType {
  holdings: Holding[];
  capitalGains: CapitalGains;
  selectedCoins: Set<string>; // Set of coin + '_' + coinName
  dataset: "screenshot" | "prompt";
  theme: "dark" | "light";
  isLoading: boolean;
  error: string | null;
  stcgTaxRate: number;
  ltcgTaxRate: number;
  harvestPercentages: Record<string, number>; // Maps uid -> percentage to sell (25, 50, 75, 100)
  toggleCoin: (uniqueId: string) => void;
  toggleAllCoins: (select: boolean) => void;
  changeDataset: (ds: "screenshot" | "prompt") => void;
  toggleTheme: () => void;
  setStcgTaxRate: (rate: number) => void;
  setLtcgTaxRate: (rate: number) => void;
  setHarvestPercentage: (uniqueId: string, percentage: number) => void;
  autoSelectOptimal: () => void;
  preHarvest: {
    stcg: { profits: number; losses: number; net: number };
    ltcg: { profits: number; losses: number; net: number };
    realised: number;
    tax: number;
  };
  postHarvest: {
    stcg: { profits: number; losses: number; net: number };
    ltcg: { profits: number; losses: number; net: number };
    realised: number;
    tax: number;
  };
  taxSavings: number;
}

const TaxContext = createContext<TaxContextType | undefined>(undefined);

export const TaxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [capitalGains, setCapitalGains] = useState<CapitalGains>(SCREENSHOT_CAPITAL_GAINS);
  const [selectedCoins, setSelectedCoins] = useState<Set<string>>(new Set(["ETH_Ethereum"])); // Pre-select ETH to match screenshot state!
  const [dataset, setDataset] = useState<"screenshot" | "prompt">("screenshot");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Extra features states
  const [stcgTaxRate, setStcgTaxRateState] = useState<number>(30);
  const [ltcgTaxRate, setLtcgTaxRateState] = useState<number>(11);
  const [harvestPercentages, setHarvestPercentages] = useState<Record<string, number>>({});

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [gainsData, holdingsData] = await Promise.all([
          fetchCapitalGains(dataset),
          fetchHoldings()
        ]);
        setCapitalGains(gainsData);
        setHoldings(holdingsData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch tax and holdings data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [dataset]);

  // Unique key helper to identify assets safely
  const getUniqueId = (holding: Holding) => `${holding.coin}_${holding.coinName}`;

  const toggleCoin = (uniqueId: string) => {
    const next = new Set(selectedCoins);
    if (next.has(uniqueId)) {
      next.delete(uniqueId);
    } else {
      next.add(uniqueId);
      // Default to 100% if newly selected
      if (harvestPercentages[uniqueId] === undefined) {
        setHarvestPercentages(prev => ({ ...prev, [uniqueId]: 100 }));
      }
    }
    setSelectedCoins(next);
  };

  const toggleAllCoins = (select: boolean) => {
    if (select) {
      const allIds = holdings.map(getUniqueId);
      setSelectedCoins(new Set(allIds));
      // Initialize percentages to 100% for all if not set
      const newPercentages = { ...harvestPercentages };
      allIds.forEach(id => {
        if (newPercentages[id] === undefined) {
          newPercentages[id] = 100;
        }
      });
      setHarvestPercentages(newPercentages);
    } else {
      setSelectedCoins(new Set());
    }
  };

  const changeDataset = (ds: "screenshot" | "prompt") => {
    setDataset(ds);
    // Reset selections on dataset change
    if (ds === "screenshot") {
      setSelectedCoins(new Set(["ETH_Ethereum"]));
    } else {
      setSelectedCoins(new Set());
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setStcgTaxRate = (rate: number) => {
    setStcgTaxRateState(Math.max(0, Math.min(100, rate)));
  };

  const setLtcgTaxRate = (rate: number) => {
    setLtcgTaxRateState(Math.max(0, Math.min(100, rate)));
  };

  const setHarvestPercentage = (uniqueId: string, percentage: number) => {
    setHarvestPercentages(prev => ({
      ...prev,
      [uniqueId]: Math.max(0, Math.min(100, percentage))
    }));
  };

  // Auto select Optimal Assets algorithm
  const autoSelectOptimal = () => {
    const optimalIds = new Set<string>();
    const newPercentages = { ...harvestPercentages };

    holdings.forEach(holding => {
      const uid = getUniqueId(holding);
      // An asset is optimal for loss harvesting if it has ANY net capital loss.
      // E.g., short-term loss < 0 OR long-term loss < 0.
      if (holding.stcg.gain < 0 || holding.ltcg.gain < 0) {
        optimalIds.add(uid);
        newPercentages[uid] = 100; // Recommend 100% harvest
      }
    });

    setSelectedCoins(optimalIds);
    setHarvestPercentages(newPercentages);
  };

  // Pre-Harvest Gains Calculations
  const preSTCGNet = capitalGains.stcg.profits - capitalGains.stcg.losses;
  const preLTCGNet = capitalGains.ltcg.profits - capitalGains.ltcg.losses;
  const preRealised = preSTCGNet + preLTCGNet;

  // Pre-harvest Tax liability
  const preSTCGTaxable = Math.max(0, preSTCGNet);
  const preLTCGTaxable = Math.max(0, preLTCGNet);
  const preTax = preSTCGTaxable * (stcgTaxRate / 100) + preLTCGTaxable * (ltcgTaxRate / 100);

  const preHarvest = {
    stcg: {
      profits: capitalGains.stcg.profits,
      losses: capitalGains.stcg.losses,
      net: preSTCGNet
    },
    ltcg: {
      profits: capitalGains.ltcg.profits,
      losses: capitalGains.ltcg.losses,
      net: preLTCGNet
    },
    realised: preRealised,
    tax: preTax
  };

  // Post-Harvest Gains Calculations
  let postSTCGProfits = capitalGains.stcg.profits;
  let postSTCGLosses = capitalGains.stcg.losses;
  let postLTCGProfits = capitalGains.ltcg.profits;
  let postLTCGLosses = capitalGains.ltcg.losses;

  holdings.forEach((holding) => {
    const uid = getUniqueId(holding);
    if (selectedCoins.has(uid)) {
      const percent = harvestPercentages[uid] ?? 100;
      const factor = percent / 100;

      // Short-Term Gain proportional impact
      const stcgGain = holding.stcg.gain * factor;
      if (stcgGain > 0) {
        postSTCGProfits += stcgGain;
      } else if (stcgGain < 0) {
        postSTCGLosses += Math.abs(stcgGain);
      }

      // Long-Term Gain proportional impact
      const ltcgGain = holding.ltcg.gain * factor;
      if (ltcgGain > 0) {
        postLTCGProfits += ltcgGain;
      } else if (ltcgGain < 0) {
        postLTCGLosses += Math.abs(ltcgGain);
      }
    }
  });

  const postSTCGNet = postSTCGProfits - postSTCGLosses;
  const postLTCGNet = postLTCGProfits - postLTCGLosses;
  const postRealised = postSTCGNet + postLTCGNet;

  // Post-harvest Tax liability
  const postSTCGTaxable = Math.max(0, postSTCGNet);
  const postLTCGTaxable = Math.max(0, postLTCGNet);
  const postTax = postSTCGTaxable * (stcgTaxRate / 100) + postLTCGTaxable * (ltcgTaxRate / 100);

  const postHarvest = {
    stcg: {
      profits: postSTCGProfits,
      losses: postSTCGLosses,
      net: postSTCGNet
    },
    ltcg: {
      profits: postLTCGProfits,
      losses: postLTCGLosses,
      net: postLTCGNet
    },
    realised: postRealised,
    tax: postTax
  };

  // Tax Savings calculations
  const rawSavings = preTax - postTax;
  const taxSavings = rawSavings > 0 ? Math.round(rawSavings) : 0;

  return (
    <TaxContext.Provider
      value={{
        holdings,
        capitalGains,
        selectedCoins,
        dataset,
        theme,
        isLoading,
        error,
        stcgTaxRate,
        ltcgTaxRate,
        harvestPercentages,
        toggleCoin,
        toggleAllCoins,
        changeDataset,
        toggleTheme,
        setStcgTaxRate,
        setLtcgTaxRate,
        setHarvestPercentage,
        autoSelectOptimal,
        preHarvest,
        postHarvest,
        taxSavings
      }}
    >
      {children}
    </TaxContext.Provider>
  );
};

export const useTax = () => {
  const context = useContext(TaxContext);
  if (context === undefined) {
    throw new Error("useTax must be used within a TaxProvider");
  }
  return context;
};
