import { useMemo, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { apiClient } from "@/shared/api/request";
import { useAddExpense } from "@/pages/DashBoard/hooks/useAddExpense";
import { useFinance } from "@/context/FinanceContext";

const ExpenseQuickForm = ({ onSuccess, onClose }) => {
  const { toast } = useToast();
  const { categories } = useAddExpense();
  const { onExpenseMutated } = useFinance();
  const [formData, setFormData] = useState({
    amount: "",
    categoryId: "",
    subcategory: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryOptions = useMemo(() => {
    return (Array.isArray(categories) ? categories : []).filter(
      (category) => !category.parentId
    );
  }, [categories]);

  const selectedCategory = categoryOptions.find(
    (item) => item._id === formData.categoryId
  );

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.amount || !selectedCategory || !formData.subcategory) {
      toast({
        title: "Missing fields",
        description: "Amount, category, and subcategory are required.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post("/expense/add", {
        categories: [
          {
            name: selectedCategory.name,
            subCategories: [
              {
                name: formData.subcategory,
                amount: Number(formData.amount),
                date: new Date().toISOString(),
                description: formData.description,
                label: selectedCategory.name,
              },
            ],
          },
        ],
      });
      await onExpenseMutated();
      toast({ title: "Expense added", description: "Saved successfully." });
      setFormData({ amount: "", categoryId: "", subcategory: "", description: "" });
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to add expense.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
        <label className="text-[11px] font-semibold text-slate-500">Amount (NGN)</label>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
          className="mt-1 w-full bg-transparent text-sm text-slate-700 outline-none"
          placeholder="e.g. 2500"
        />
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
        <label className="text-[11px] font-semibold text-slate-500">Category</label>
        <select
          value={formData.categoryId}
          onChange={(e) => handleChange("categoryId", e.target.value)}
          className="mt-1 w-full bg-transparent text-sm text-slate-700 outline-none"
        >
          <option value="">Select category</option>
          {categoryOptions.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
        <label className="text-[11px] font-semibold text-slate-500">Subcategory</label>
        <input
          value={formData.subcategory}
          onChange={(e) => handleChange("subcategory", e.target.value)}
          className="mt-1 w-full bg-transparent text-sm text-slate-700 outline-none"
          placeholder="Transport, data, groceries"
        />
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
        <label className="text-[11px] font-semibold text-slate-500">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="mt-1 min-h-[90px] w-full bg-transparent text-sm text-slate-700 outline-none"
          placeholder="Optional note"
        />
      </div>
      <div className="flex items-center justify-end gap-2">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-[#f47d4a] px-4 py-2 text-xs font-semibold text-white hover:bg-[#e56f3d] disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Add expense"}
        </button>
      </div>
    </form>
  );
};

export default ExpenseQuickForm;
