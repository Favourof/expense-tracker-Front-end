import { useState, useEffect } from 'react';
import { publicRequest } from '@/shared/api/request';

export const useGetExpenses = () => {
  const [userId, setUserId] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [weeklyExpenses, setWeeklyExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      fetchExpenses(storedUserId);
    }
  }, []);

  const fetchExpenses = async (userId) => {
    try {
      setIsLoading(true);
      const response = await publicRequest.get(`/expense/all/${userId}`);
      if (response.status === 200) {
        const expenses = response.data.expenses;
        const recentMonthExpenses = filterRecentMonthExpenses(expenses);
        setExpenses(recentMonthExpenses);
        setWeeklyExpenses(processWeeklyExpenses(recentMonthExpenses));
        console.log(recentMonthExpenses);
      }
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRecentMonthExpenses = (expenses) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfMonth && expenseDate <= endOfMonth;
    });
  };

  const processWeeklyExpenses = (expenses) => {
    const weeks = Array.from({ length: 5 }, () => 0); // Initialize 5 weeks with 0

    expenses.forEach(expense => {
      if (expense.categories && expense.categories.length > 0) {
        expense.categories.forEach(category => {
          if (category.subCategories && category.subCategories.length > 0) {
            category.subCategories.forEach(subCategory => {
              const expenseDate = new Date(subCategory.date);
              const weekNumber = Math.ceil(expenseDate.getDate() / 7) - 1; // Determine the week number (0-based)
              weeks[weekNumber] += subCategory.amount;
            });
          }
        });
      }
    });

    return weeks.map((amount, index) => ({
      week: `Week ${index + 1}`,
      amount,
    }));
  };

  return { expenses, weeklyExpenses, isLoading, fetchExpenses };
};
