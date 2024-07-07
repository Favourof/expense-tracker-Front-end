import { useState, useEffect } from "react";
import { useGetAllIncome } from "./useGetAllIcome";
// import { useGetAllIncome } from "./useGetAllIncome";

const useCurrencyConverter = (currency) => {
  const [conversionRate, setConversionRate] = useState(1);
  const { allIncome } = useGetAllIncome();

  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/NGN`);
        const data = await response.json();
        const rate = data.rates[currency] || 1;
        setConversionRate(rate);
        localStorage.setItem('cov', rate);
      } catch (error) {
        console.error("Error fetching conversion rates:", error);
      }
    };

    fetchConversionRate();
  }, [currency, allIncome]);

  return conversionRate;
};

export default useCurrencyConverter;
