import { useState, useEffect } from "react";
import { publicRequest } from "@/shared/api/request";

export const useAddExpense = () => {
  const [userId, setUserId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isloading, setIsloading] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      getCategories(storedUserId);
    }
  }, []);

  const getCategories = async (storedUserId) => {
    try {
      setIsloading(true);
      const response = await publicRequest.get(`/expense/all/${storedUserId}`);
      if (response) {
        const fetchedCategories = response.data.expenses.flatMap(expense => expense.categories);
        setCategories(fetchedCategories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsloading(false);
    }
  };

  const handleAddCategory = async (categoryName) => {
    if (!categoryName) return;

    const newCategory = {
      name: categoryName,
      subCategories: []
    };

    try {
      setIsloading(true);
      if (userId) {
        const response = await publicRequest.post(`/expense/add`, {
          userId,
          categories: [newCategory],
        });

        if (response.status === 201) {
          await getCategories(userId);
        }
        console.log('Category added:', response.data);
      }
    } catch (error) {
      console.error("Failed to add category:", error);
    } finally {
      setIsloading(false);
    }
  };

  const handleAddSubCategory = async (category, subCategory) => {
    try {
      setIsloading(true);
      const updatedCategories = categories.map(cat => {
        if (cat.name === category.name) {
          return { ...cat, subCategories: [...cat.subCategories, subCategory] };
        }
        return cat;
      });

      const response = await publicRequest.post(`/expense/update`, {
        userId,
        categories: updatedCategories
      });

      if (response.status === 200) {
        setCategories(updatedCategories);
      }
    } catch (error) {
      console.error('Failed to add subcategory:', error);
    } finally {
      setIsloading(false);
    }
  };

  return { handleAddCategory, handleAddSubCategory, categories, getCategories, isloading };
};
