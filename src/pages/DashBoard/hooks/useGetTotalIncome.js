import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, getTotalIncome, getTotalExpense } from "@/features/AuthPage/AuthSlice";

export const useGetTotalIncome = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1); // getMonth() returns 0-11, so add 1 for 1-12
  const [year, setYear] = useState(now.getFullYear());
  const dispatch = useDispatch();
  const { currentUser, incomeData, expenseData } = useSelector((state) => state.auth);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
    

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

  const getInitialCurrency = () => {
    const savedCurrency = localStorage.getItem("currency");
    return savedCurrency || "USD";
  };

  const [currency, setCurrency] = useState(getInitialCurrency());

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  useEffect(() => {
    dispatch(getCurrentUser( )); // Dispatch the action to get the current user
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  useEffect(() => {
    if (currentUser) {
      dispatch(getTotalIncome({ userId: currentUser._id, year, month }));
      dispatch(getTotalExpense({userId: currentUser._id, year, month}))
    }
  }, [currentUser, year, month, dispatch]);

  return { month, year, currentUser, incomeData, expenseData, handleCurrencyChange, currency, formatDate, handleStartDateChange, handleEndDateChange, endDate, startDate };
};
