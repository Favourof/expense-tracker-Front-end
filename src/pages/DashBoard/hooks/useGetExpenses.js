import { useFinance } from "@/context/FinanceContext";

export const useGetExpenses = () => {
  const {
    expenses,
    weeklyExpenses,
    isExpenseLoading,
    fetchExpenses,
  } = useFinance();

  return {
    expenses,
    weeklyExpenses,
    isLoading: isExpenseLoading,
    fetchExpenses,
  };
};
