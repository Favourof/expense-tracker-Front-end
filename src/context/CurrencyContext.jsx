import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CurrencyContext = createContext(null);

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(
    localStorage.getItem("currency") || "NGN"
  );
  const [rate, setRate] = useState(1);
  const baseCurrency = "NGN";

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        if (currency === baseCurrency) {
          setRate(1);
          return;
        }
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
        );
        const data = await response.json();
        const newRate = data?.rates?.[currency] || 1;
        setRate(newRate);
        localStorage.setItem("cov", newRate);
      } catch (error) {
        console.error("Error fetching conversion rates:", error);
        setRate(1);
      }
    };

    fetchRate();
  }, [currency]);

  const format = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format((amount || 0) * rate);

  const value = useMemo(
    () => ({ currency, setCurrency, rate, format, baseCurrency }),
    [currency, rate]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return ctx;
};
