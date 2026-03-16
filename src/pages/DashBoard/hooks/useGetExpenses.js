import { useState, useEffect } from 'react';
import { apiClient } from '@/shared/api/request';

export const useGetExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [weeklyExpenses, setWeeklyExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/expense/all`);
      if (response.status === 200) {
        const raw = response.data?.items ?? response.data?.expenses ?? response.data?.data ?? response.data ?? [];
        const expenses = Array.isArray(raw)
          ? raw.map((item) => ({ ...item, date: item.timestamp || item.date }))
          : [];
        const recentMonthExpenses = filterRecentMonthExpenses(expenses);
        setExpenses(recentMonthExpenses);
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const weeklyRes = await apiClient.get(`/summary/${year}/${month}/weekly`);
        const weeklyList = Array.isArray(weeklyRes.data) ? weeklyRes.data : [];
        setWeeklyExpenses(
          weeklyList.map((week) => ({
            week: `Week ${week.week}`,
            amount: week.totalExpense || 0,
          }))
        );
        console.log(recentMonthExpenses);
      }
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRecentMonthExpenses = (expenses) => {
    const safeExpenses = Array.isArray(expenses) ? expenses : [];
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return safeExpenses.filter(expense => {
      if (!expense?.date) return false;
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfMonth && expenseDate <= endOfMonth;
    });
  };

  return { expenses, weeklyExpenses, isLoading, fetchExpenses };
};
