import React, { useState } from "react";
import DetailDrawer from "@/components/shared/DetailDrawer";
import { apiClient } from "@/shared/api/request";
import { useToast } from "@/components/ui/use-toast";
import { useFinance } from "@/context/FinanceContext";

const AddSubCategoryForm = ({ category, onAddSubCategory, onClose }) => {
  const [subCategoryName, setSubCategoryName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { onExpenseMutated } = useFinance();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subCategoryName || !amount) return;
    try {
      setIsSubmitting(true);
      await apiClient.post("/expense/add", {
        categories: [
          {
            name: category.name,
            subCategories: [
              {
                name: subCategoryName,
                amount: Number(amount),
                date: new Date().toISOString(),
                description,
                label: category.name,
              },
            ],
          },
        ],
      });
      await onExpenseMutated();
      toast({
        title: "Expense added",
        description: `${subCategoryName} logged under ${category.name}.`,
      });
      setSubCategoryName("");
      setAmount("");
      setDescription("");
      onClose();
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
    <DetailDrawer
      isOpen={Boolean(category)}
      onClose={onClose}
      header={
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Add expense</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              {category?.name}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Add a subcategory expense to this group.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
          <label className="text-[11px] font-semibold text-slate-500">Subcategory</label>
          <input
            type="text"
            value={subCategoryName}
            onChange={(e) => setSubCategoryName(e.target.value)}
            placeholder="Transport, fuel, etc."
            className="mt-1 w-full bg-transparent text-sm text-slate-700 outline-none"
            required
          />
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
          <label className="text-[11px] font-semibold text-slate-500">Amount (NGN)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 3500"
            className="mt-1 w-full bg-transparent text-sm text-slate-700 outline-none"
            required
          />
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
          <label className="text-[11px] font-semibold text-slate-500">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional note (e.g. Uber to work)"
            className="mt-1 min-h-[90px] w-full bg-transparent text-sm text-slate-700 outline-none"
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-[#f47d4a] px-4 py-2 text-xs font-semibold text-white hover:bg-[#e56f3d] disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Add expense"}
          </button>
        </div>
      </form>
    </DetailDrawer>
  );
};

export default AddSubCategoryForm;
