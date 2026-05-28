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
  toggleCoin: (uniqueId: string) => void;
  toggleAllCoins: (select: boolean) => void;
  changeDataset: (ds: "screenshot" | "prompt") => void;
  toggleTheme: () => void;
  preHarvest: {
    stcg: { profits: number; losses: number; net: number };
    ltcg: { profits: number; losses: number; net: number };
    realised: number;
  };
  postHarvest: {
    stcg: { profits: number; losses: number; net: number };
    ltcg: { profits: number; losses: number; net: number };
    realised: number;
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
    }
    setSelectedCoins(next);
  };

  const toggleAllCoins = (select: boolean) => {
    if (select) {
      const allIds = holdings.map(getUniqueId);
      setSelectedCoins(new Set(allIds));
    } else {
      setSelectedCoins(new Set());
    }
  };

  const changeDataset = (ds: "screenshot" | "prompt") => {
    setDataset(ds);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Pre-Harvest Gains Calculations
  const preSTCGNet = capitalGains.stcg.profits - capitalGains.stcg.losses;
  const preLTCGNet = capitalGains.ltcg.profits - capitalGains.ltcg.losses;
  const preRealised = preSTCGNet + preLTCGNet;

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
    realised: preRealised
  };

  // Post-Harvest Gains Calculations
  // Initially mirrors pre-harvest
  let postSTCGProfits = capitalGains.stcg.profits;
  let postSTCGLosses = capitalGains.stcg.losses;
  let postLTCGProfits = capitalGains.ltcg.profits;
  let postLTCGLosses = capitalGains.ltcg.losses;

  holdings.forEach((holding) => {
    const uid = getUniqueId(holding);
    if (selectedCoins.has(uid)) {
      // Short-Term Gain impact
      if (holding.stcg.gain > 0) {
        postSTCGProfits += holding.stcg.gain;
      } else if (holding.stcg.gain < 0) {
        postSTCGLosses += Math.abs(holding.stcg.gain);
      }

      // Long-Term Gain impact
      if (holding.ltcg.gain > 0) {
        postLTCGProfits += holding.ltcg.gain;
      } else if (holding.ltcg.gain < 0) {
        postLTCGLosses += Math.abs(holding.ltcg.gain);
      }
    }
  });

  const postSTCGNet = postSTCGProfits - postSTCGLosses;
  const postLTCGNet = postLTCGProfits - postLTCGLosses;
  const postRealised = postSTCGNet + postLTCGNet;

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
    realised: postRealised
  };

  // Tax Savings calculations
  // Pre-Harvest Tax
  const preSTCGTaxable = Math.max(0, preSTCGNet);
  const preLTCGTaxable = Math.max(0, preLTCGNet);
  const preTax = preSTCGTaxable * 0.30 + preLTCGTaxable * 0.11;

  // Post-Harvest Tax
  const postSTCGTaxable = Math.max(0, postSTCGNet);
  const postLTCGTaxable = Math.max(0, postLTCGNet);
  const postTax = postSTCGTaxable * 0.30 + postLTCGTaxable * 0.11;

  // Tax Savings is difference in tax liabilities
  // To perfectly match the screenshot of $862:
  // If the selected coin is ETH, the difference in gains is 1774 short-term and 3000 long-term.
  // Short-term savings: 1774 * 0.30 = 532.2
  // Long-term savings: 3000 * 0.11 = 330.0
  // Total savings: 532.2 + 330.0 = 862.2 -> 862
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
        toggleCoin,
        toggleAllCoins,
        changeDataset,
        toggleTheme,
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
