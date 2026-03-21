import { useEffect, useState } from "react";
import { apiClient } from "@/shared/api/request";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

export const useAddExpense = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, isUserLoading } = useAuth();

  useEffect(() => {
    if (!isUserLoading && currentUser) {
      getCategories();
    }
  }, [isUserLoading, currentUser]);

  const getCategories = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/categories?type=expense`);
      const items = Array.isArray(response?.data?.items) ? response.data.items : [];
      setCategories(items);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      if (error?.response?.status === 401) {
        toast({
          title: "Session expired",
          description: "Please log in again to load categories.",
        });
      }
      toast({
        title: "Error",
        description: "Unable to load categories.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (categoryName) => {
    if (!categoryName) return;
    try {
      setIsLoading(true);
      const response = await apiClient.post(`/categories`, {
        name: categoryName,
        type: "expense",
      });

      if (response.status === 201) {
        await getCategories();
        toast({
          title: "Category added",
          description: "New expense category created.",
        });
      } else {
        toast({
          title: "Unable to add",
          description: "Category already exists.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to add category.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubCategory = async (category, subCategory) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post(`/categories`, {
        name: subCategory.name,
        type: "expense",
        parentId: category._id,
      });

      if (response.status === 201) {
        await getCategories();
        toast({
          title: "Subcategory added",
          description: "Expense saved under category.",
        });
      } else {
        toast({
          title: "Error",
          description: response.data?.message || "Failed to add subcategory.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleAddCategory, handleAddSubCategory, categories, getCategories, isLoading };
};
