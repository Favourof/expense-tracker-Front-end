import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "@/features/AuthPage/AuthSlice";
import { publicRequest } from "@/shared/api/request";

export const useGetAllIncome = () => {
  const [allIncome, setAllIncome] = useState([]);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const [weeklyIncomes, setWeeklyIncomes] = useState([0, 0, 0, 0, 0]); // Assuming maximum 5 weeks in a month

  const handleGetAllIncome = async () => {
    try {
      if (currentUser) {
        const response = await publicRequest.get(`/income/${currentUser._id}`);
        if (response && response.data) {
          setAllIncome(response.data);
          const weeklyIncomeTemp = [0, 0, 0, 0, 0]; // Temporary array for weekly incomes
          response.data.forEach((income) => {
            const week = income.weekOfMonth;
            if (week > 0 && week <= 5) {
              weeklyIncomeTemp[week - 1] += income.amount;
            }
          });
          setWeeklyIncomes(weeklyIncomeTemp);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      handleGetAllIncome();
    }
  }, [currentUser]);

  return { allIncome, handleGetAllIncome, weeklyIncomes };
};
