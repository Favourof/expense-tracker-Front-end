import { useState, useEffect } from "react";
import { apiClient } from "@/shared/api/request";
import { toast } from "@/components/ui/use-toast";

export const useAddExpense = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/expense/all`);
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
      const response = await apiClient.post(`/expense/add`, {
        categories: [newCategory],
      });

      if (response.status === 201) {
        await getCategories();
      } else {
        toast({
          title : 'hello',
          description : 'Category Already exit'
        })
      }
    
      // console.log('Category added:', response.data);
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
      const response = await apiClient.post(`/expense/subcategory/add`, {
        categoryName: category.name,
        subCategory,
      });

      if (response.status === 200) {
        await getCategories();
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
