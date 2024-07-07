import { useState, useEffect } from "react";
import { publicRequest } from "@/shared/api/request";
import { toast } from "@/components/ui/use-toast";

export const useAddExpense = () => {
  const [userId, setUserId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      getCategories(storedUserId);
    }
  }, []);

  const getCategories = async (storedUserId) => {
    try {
      setIsLoading(true);
      const response = await publicRequest.get(`/expense/all/${storedUserId}`);
      if (response) {
        const fetchedCategories = response.data.expenses.flatMap(expense => expense.categories);
        setCategories(fetchedCategories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (categoryName) => {
    if (!categoryName) return;

    const newCategory = {
      name: categoryName,
      subCategories: []
    };

    try {
      setIsLoading(true);
      if (userId) {
        const response = await publicRequest.post(`/expense/add`, {
          userId,
          categories: [newCategory],
        });

        if (response.status === 201) {
          await getCategories(userId);

        }else{
          toast({
            title : 'hello',
            description : 'Category Already exit'
          })
        }
      
        // console.log('Category added:', response.data);
      }
    } catch (error) {
      // console.error("Failed to add category:", error);
      toast({
          title : 'hello❌❌',
          description : 'Category Added Succefully'
      })
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubCategory = async (category, subCategory) => {
    try {
      setIsLoading(true);
      const response = await publicRequest.post(`/expense/subcategory/add`, {
        userId,
        categoryName: category.name,
        subCategory,
      });

      if (response.status === 200) {
        await getCategories(userId);
        toast({
          title: 'succefully Added',
          description: response.message
        })
        console.log('success')
      } else {
        console.error('Failed to add subcategory:', response.data.message);
        toast({
          title: 'Error',
          description: response.data.message
        })
      }
    } catch (error) {
      console.error('Failed to add subcategory:', error);
      toast({
        title: 'Error',
        description: error.message
      })
    } finally {
      setIsLoading(false);
    }
  };

  return { handleAddCategory, handleAddSubCategory, categories, getCategories, isLoading };
};
