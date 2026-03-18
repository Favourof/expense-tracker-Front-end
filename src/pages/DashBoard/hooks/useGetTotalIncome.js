import { useState, useEffect } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { useFinance } from "@/context/FinanceContext";

export const useGetTotalIncome = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1); // getMonth() returns 0-11, so add 1 for 1-12
  const [year, setYear] = useState(now.getFullYear());
  const { incomeSummary, expenseSummary, fetchTotals } = useFinance();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [recentCovert, setrecentCovert] = useState();
    // console.log(incomeData)
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const formatDate = (date) => {
    const incomeDate = new Date(date);
    const now = new Date();
    const diffMs = now - incomeDate;
    const diffMins = Math.floor(diffMs / 60000); // Convert milliseconds to minutes
    const diffHours = Math.floor(diffMs / 3600000); // Convert milliseconds to hours
    const diffDays = Math.floor(diffMs / 86400000); // Convert milliseconds to days

    if (diffHours < 1) {
      return `${diffMins} minutes ago`;
    } else if (diffDays < 1) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  };

  const { currency, setCurrency } = useCurrency();

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  useEffect(() => {}, [currency]);

  useEffect(() => {
    fetchTotals();
  }, [year, month, fetchTotals]);

  return { 
    month, 
    year, 
    incomeData: incomeSummary, 
    expenseData: expenseSummary, 
    handleCurrencyChange, 
    currency, 
    formatDate, 
    handleStartDateChange, 
    handleEndDateChange, 
    endDate, 
    startDate,
    recentCovert,
    refreshTotals: fetchTotals
  };
};
