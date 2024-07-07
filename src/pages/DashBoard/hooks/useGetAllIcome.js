import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "@/features/AuthPage/AuthSlice";
import { publicRequest } from "@/shared/api/request";

export const useGetAllIncome = () => {
  const [allIncome, setAllIncome] = useState([]);
  const dispatch = useDispatch();
  const [weeklyIncome, setWeeklyIncome] = useState([]);
  const { currentUser } = useSelector((state) => state.auth);
  
  const [isloading, setisloading] = useState(false);

  const handleGetAllIncome = async () => {
    setisloading(true)
    try {
      if (currentUser) {
        const response = await publicRequest.get(`/income/${currentUser._id}`);
        if (response && response.data) {
          setAllIncome(response.data);
          const income = response.data;
          const recentMonthIncome = filterRecentMonthIncome(income);
          // setAllIncome(recentMonthIncome);
          setWeeklyIncome(processWeeklyIncome(recentMonthIncome));
         
        }
      }
    } catch (error) {
      console.log(error);
    }finally{
      setisloading(false)
    }
  };

  const filterRecentMonthIncome = (income) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return income.filter(item => {
      const incomeDate = new Date(item.date);
      return incomeDate >= startOfMonth && incomeDate <= endOfMonth;
    });
  };

  const processWeeklyIncome = (income) => {
    const weeks = Array.from({ length: 5 }, () => 0); // Initialize 5 weeks with 0

    income.forEach(item => {
      const incomeDate = new Date(item.date);
      const weekNumber = Math.ceil(incomeDate.getDate() / 7) - 1; // Determine the week number (0-based)
      weeks[weekNumber] += item.amount;
    });

    return weeks.map((amount, index) => ({
      week: `Week ${index + 1}`,
      amount,
    }));
  };

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      handleGetAllIncome();
    }
  }, [currentUser]);

  return { allIncome, handleGetAllIncome, weeklyIncome,  isloading };
};
