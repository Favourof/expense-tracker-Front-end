import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "@/features/AuthPage/AuthSlice";
import { publicRequest } from "@/shared/api/request";

export const useGetAllIncome = () => {
  const [allIncome, setAllIncome] = useState([]);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);

  const handleGetAllIncome = async () => {
    try {
      if (currentUser) {
        const response = await publicRequest.get(`/income/${currentUser._id}`);
        if (response && response.data) {
          setAllIncome(response.data);
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

  return { allIncome, handleGetAllIncome };
};
