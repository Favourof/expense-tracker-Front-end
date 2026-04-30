import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { apiClient } from "@/shared/api/request";
import { useAuth } from "@/context/AuthContext";
import { clearFinanceSnapshot, getFinanceSnapshot, setFinanceSnapshot } from "@/shared/storage/financeCache";

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

const getFinanceCacheKey = (user) =>
  user?._id || user?.id || user?.email || user?.username || "";

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
  const financeCacheKey = useMemo(() => getFinanceCacheKey(currentUser), [currentUser]);
  const previousFinanceCacheKeyRef = useRef("");
  const cacheSnapshotRef = useRef({
    allIncome: [],
    weeklyIncome: [],
    expenses: [],
    weeklyExpenses: [],
    incomeSummary: null,
    expenseSummary: null,
  });

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  useEffect(() => {
    cacheSnapshotRef.current = {
      allIncome,
      weeklyIncome,
      expenses,
      weeklyExpenses,
      incomeSummary,
      expenseSummary,
    };
  }, [allIncome, weeklyIncome, expenses, weeklyExpenses, incomeSummary, expenseSummary]);

  const resetFinanceState = useCallback(() => {
    cacheSnapshotRef.current = {
      allIncome: [],
      weeklyIncome: [],
      expenses: [],
      weeklyExpenses: [],
      incomeSummary: null,
      expenseSummary: null,
    };
    setAllIncome([]);
    setWeeklyIncome([]);
    setExpenses([]);
    setWeeklyExpenses([]);
    setIncomeSummary(null);
    setExpenseSummary(null);
    setIsIncomeLoading(false);
    setIsExpenseLoading(false);
    setIsTotalsLoading(false);
  }, []);

  const persistFinanceSnapshot = useCallback(
    async (overrides = {}) => {
      if (!financeCacheKey) return;

      const snapshot = {
        ...cacheSnapshotRef.current,
        ...overrides,
      };
      cacheSnapshotRef.current = snapshot;

      try {
        await setFinanceSnapshot(financeCacheKey, snapshot);
      } catch (error) {
        console.warn("Failed to persist finance snapshot:", error);
      }
    },
    [financeCacheKey]
  );

  const hydrateFinanceSnapshot = useCallback(async () => {
    if (!financeCacheKey) return;

    try {
      const stored = await getFinanceSnapshot(financeCacheKey);
      const snapshot = stored?.snapshot;

      if (!snapshot) return;

      cacheSnapshotRef.current = {
        ...cacheSnapshotRef.current,
        ...snapshot,
      };

      if (Array.isArray(snapshot.allIncome)) {
        setAllIncome(snapshot.allIncome);
      }
      if (Array.isArray(snapshot.weeklyIncome)) {
        setWeeklyIncome(snapshot.weeklyIncome);
      }
      if (Array.isArray(snapshot.expenses)) {
        setExpenses(snapshot.expenses);
      }
      if (Array.isArray(snapshot.weeklyExpenses)) {
        setWeeklyExpenses(snapshot.weeklyExpenses);
      }
      setIncomeSummary(snapshot.incomeSummary ?? null);
      setExpenseSummary(snapshot.expenseSummary ?? null);
    } catch (error) {
      console.warn("Failed to hydrate finance cache:", error);
    }
  }, [financeCacheKey]);

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
      const normalizedIncome = normalizeIncome(incomeItems);
      setAllIncome(normalizedIncome);

      const weeklyRes = await apiClient.get(`/income/summary/${year}/${month}/weekly`);
      const weeklyList = Array.isArray(weeklyRes.data) ? weeklyRes.data : [];
      const nextWeeklyIncome =
        weeklyList.map((week) => ({
          week: `Week ${week.week}`,
          amount: week.totalIncome || 0,
        }));
      setWeeklyIncome(nextWeeklyIncome);
      await persistFinanceSnapshot({
        allIncome: normalizedIncome,
        weeklyIncome: nextWeeklyIncome,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsIncomeLoading(false);
    }
  }, [currentUser, month, year, persistFinanceSnapshot]);

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
      const nextExpenses = filterRecentMonthExpenses(normalized);
      setExpenses(nextExpenses);

      const weeklyRes = await apiClient.get(`/summary/${year}/${month}/weekly`);
      const weeklyList = Array.isArray(weeklyRes.data) ? weeklyRes.data : [];
      const nextWeeklyExpenses =
        weeklyList.map((week) => ({
          week: `Week ${week.week}`,
          amount: week.totalExpense || 0,
        }));
      setWeeklyExpenses(nextWeeklyExpenses);
      await persistFinanceSnapshot({
        expenses: nextExpenses,
        weeklyExpenses: nextWeeklyExpenses,
      });
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      setIsExpenseLoading(false);
    }
  }, [currentUser, month, year, persistFinanceSnapshot]);

  const fetchTotals = useCallback(async () => {
    if (!currentUser) return;
    setIsTotalsLoading(true);
    try {
      const [incomeRes, expenseRes] = await Promise.all([
        apiClient.get(`/income/summary/${year}/${month}`),
        apiClient.get(`/expense/monthly/${year}/${month}`),
      ]);
      const nextIncomeSummary = incomeRes?.data || null;
      const nextExpenseSummary = expenseRes?.data || null;
      setIncomeSummary(nextIncomeSummary);
      setExpenseSummary(nextExpenseSummary);
      await persistFinanceSnapshot({
        incomeSummary: nextIncomeSummary,
        expenseSummary: nextExpenseSummary,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsTotalsLoading(false);
    }
  }, [currentUser, month, year, persistFinanceSnapshot]);

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
    let cancelled = false;

    const run = async () => {
      if (!currentUser) {
        resetFinanceState();
        if (previousFinanceCacheKeyRef.current) {
          try {
            await clearFinanceSnapshot(previousFinanceCacheKeyRef.current);
          } catch (error) {
            console.warn("Failed to clear finance cache:", error);
          }
        }
        previousFinanceCacheKeyRef.current = "";
        return;
      }

      if (
        previousFinanceCacheKeyRef.current &&
        previousFinanceCacheKeyRef.current !== financeCacheKey
      ) {
        try {
          await clearFinanceSnapshot(previousFinanceCacheKeyRef.current);
        } catch (error) {
          console.warn("Failed to clear previous finance cache:", error);
        }
      }

      previousFinanceCacheKeyRef.current = financeCacheKey;
      resetFinanceState();
      await hydrateFinanceSnapshot();

      if (!cancelled) {
        await refreshAll();
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [currentUser, financeCacheKey, hydrateFinanceSnapshot, refreshAll, resetFinanceState]);

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
      fetchIncome,
      fetchExpenses,
      fetchTotals,
      refreshAll,
      onIncomeMutated,
      onExpenseMutated,
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
