import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiClient } from "@/shared/api/request";
import { useAuth } from "@/context/AuthContext";

const FinanceContext = createContext(null);

const normalizeIncome = (items) =>
  (Array.isArray(items) ? items : []).map((item) => ({
    ...item,
    date: item.timestamp || item.date,
    source: item.note || item.source,
  }));

const normalizeExpenses = (items) =>
  (Array.isArray(items) ? items : []).map((item) => ({
    ...item,
    date: item.timestamp || item.date,
  }));

const filterRecentMonthExpenses = (expenses) => {
  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return safeExpenses.filter((expense) => {
    if (!expense?.date) return false;
    const expenseDate = new Date(expense.date);
    return expenseDate >= startOfMonth && expenseDate <= endOfMonth;
  });
};

export const FinanceProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [allIncome, setAllIncome] = useState([]);
  const [weeklyIncome, setWeeklyIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [weeklyExpenses, setWeeklyExpenses] = useState([]);
  const [incomeSummary, setIncomeSummary] = useState(null);
  const [expenseSummary, setExpenseSummary] = useState(null);
  const [isIncomeLoading, setIsIncomeLoading] = useState(false);
  const [isExpenseLoading, setIsExpenseLoading] = useState(false);
  const [isTotalsLoading, setIsTotalsLoading] = useState(false);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const fetchIncome = useCallback(async () => {
    if (!currentUser) return;
    setIsIncomeLoading(true);
    try {
      const response = await apiClient.get(`/income`);
      const incomeItems = Array.isArray(response.data?.items)
        ? response.data.items
        : Array.isArray(response.data)
        ? response.data
        : [];
      setAllIncome(normalizeIncome(incomeItems));

      const weeklyRes = await apiClient.get(`/income/summary/${year}/${month}/weekly`);
      const weeklyList = Array.isArray(weeklyRes.data) ? weeklyRes.data : [];
      setWeeklyIncome(
        weeklyList.map((week) => ({
          week: `Week ${week.week}`,
          amount: week.totalIncome || 0,
        }))
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsIncomeLoading(false);
    }
  }, [currentUser, month, year]);

  const fetchExpenses = useCallback(async () => {
    if (!currentUser) return;
    setIsExpenseLoading(true);
    try {
      const response = await apiClient.get(`/expense/all`);
      const raw =
        response.data?.items ??
        response.data?.expenses ??
        response.data?.data ??
        response.data ??
        [];
      const normalized = normalizeExpenses(raw);
      setExpenses(filterRecentMonthExpenses(normalized));

      const weeklyRes = await apiClient.get(`/summary/${year}/${month}/weekly`);
      const weeklyList = Array.isArray(weeklyRes.data) ? weeklyRes.data : [];
      setWeeklyExpenses(
        weeklyList.map((week) => ({
          week: `Week ${week.week}`,
          amount: week.totalExpense || 0,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      setIsExpenseLoading(false);
    }
  }, [currentUser, month, year]);

  const fetchTotals = useCallback(async () => {
    if (!currentUser) return;
    setIsTotalsLoading(true);
    try {
      const [incomeRes, expenseRes] = await Promise.all([
        apiClient.get(`/income/summary/${year}/${month}`),
        apiClient.get(`/expense/monthly/${year}/${month}`),
      ]);
      setIncomeSummary(incomeRes?.data || null);
      setExpenseSummary(expenseRes?.data || null);
    } catch (error) {
      console.log(error);
    } finally {
      setIsTotalsLoading(false);
    }
  }, [currentUser, month, year]);

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchIncome(), fetchExpenses(), fetchTotals()]);
  }, [fetchIncome, fetchExpenses, fetchTotals]);

  const onIncomeMutated = useCallback(async () => {
    await Promise.all([fetchIncome(), fetchTotals()]);
  }, [fetchIncome, fetchTotals]);

  const onExpenseMutated = useCallback(async () => {
    await Promise.all([fetchExpenses(), fetchTotals()]);
  }, [fetchExpenses, fetchTotals]);

  useEffect(() => {
    if (currentUser) {
      refreshAll();
    }
  }, [currentUser, refreshAll]);

  const value = useMemo(
    () => ({
      allIncome,
      weeklyIncome,
      expenses,
      weeklyExpenses,
      incomeSummary,
      expenseSummary,
      isIncomeLoading,
      isExpenseLoading,
      isTotalsLoading,
      isLoading: isIncomeLoading || isExpenseLoading || isTotalsLoading,
      fetchIncome,
      fetchExpenses,
      fetchTotals,
      refreshAll,
      onIncomeMutated,
      onExpenseMutated,
    }),
    [
      allIncome,
      weeklyIncome,
      expenses,
      weeklyExpenses,
      incomeSummary,
      expenseSummary,
      isIncomeLoading,
      isExpenseLoading,
      isTotalsLoading,
    ]
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

export const useFinance = () => {
  const ctx = useContext(FinanceContext);
  if (!ctx) {
    throw new Error("useFinance must be used within FinanceProvider");
  }
  return ctx;
};
