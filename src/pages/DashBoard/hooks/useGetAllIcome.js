import { useFinance } from "@/context/FinanceContext";

export const useGetAllIncome = () => {
  const {
    allIncome,
    weeklyIncome,
    isIncomeLoading,
    fetchIncome,
  } = useFinance();

  return {
    allIncome,
    weeklyIncome,
    isLoading: isIncomeLoading,
    handleGetAllIncome: fetchIncome,
  };
};
