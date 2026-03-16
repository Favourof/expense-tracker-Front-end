import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "@/features/AuthPage/AuthSlice";
import { apiClient } from "@/shared/api/request";

export const useGetAllIncome = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const [allIncome, setAllIncome] = useState([]);
  const dispatch = useDispatch();
  const [weeklyIncome, setWeeklyIncome] = useState([]);
  const { currentUser } = useSelector((state) => state.auth);
  
  const [isloading, setisloading] = useState(false);

  const handleGetAllIncome = async () => {
    setisloading(true)
    try {
      if (currentUser) {
        const response = await apiClient.get(`/income`);
        if (response && response.data) {
          if (import.meta?.env?.DEV && !Array.isArray(response.data?.items)) {
            console.debug("Income API response shape:", response.data);
          }
          const incomeItems = Array.isArray(response.data?.items)
            ? response.data.items
            : Array.isArray(response.data)
            ? response.data
            : [];
          const normalized = incomeItems.map((item) => ({
            ...item,
            date: item.timestamp || item.date,
            source: item.note || item.source,
          }));
          setAllIncome(normalized);

          const weeklyRes = await apiClient.get(`/income/summary/${year}/${month}/weekly`);
          const weeklyList = Array.isArray(weeklyRes.data) ? weeklyRes.data : [];
          setWeeklyIncome(
            weeklyList.map((week) => ({
              week: `Week ${week.week}`,
              amount: week.totalIncome || 0,
            }))
          );
         
        }
      }
    } catch (error) {
      console.log(error);
    }finally{
      setisloading(false)
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

  return { allIncome, handleGetAllIncome, weeklyIncome,  isloading };
};
