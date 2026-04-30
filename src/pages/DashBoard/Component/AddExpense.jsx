import React, { useEffect, useMemo, useState } from "react";
import { useAddExpense } from "../hooks/useAddExpense";
import Loader from "./Loader";
import AddSubCategoryForm from "./AddSubCategoryForm";
import { GiExpense } from "react-icons/gi";
import { Plus, Search, ChevronDown } from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const iconArray = [GiExpense];
const colors = [
  "bg-emerald-500",
  "bg-orange-500",
  "bg-slate-600",
  "bg-indigo-500",
  "bg-rose-500",
  "bg-teal-500",
];
const shadows = [
  "shadow-emerald-200",
  "shadow-orange-200",
  "shadow-slate-200",
  "shadow-indigo-200",
  "shadow-rose-200",
  "shadow-teal-200",
];

const hashStringToIndex = (str, arrayLength) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % arrayLength;
};

const AddExpense = () => {
  const { handleAddCategory, handleAddSubCategory, categories, isLoading, getCategories } =
    useAddExpense();
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const { toast } = useToast();
  const { expenses } = useFinance();
  const { currency, rate } = useCurrency();

  useEffect(() => {
    document.title = "AequoPath • Manage Expense";
  }, []);

  const addCategory = async (categoryName) => {
    try {
      await handleAddCategory(categoryName);
      setNewCategory("");
      setShowNewCategory(false);
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const closeForm = () => {
    setSelectedCategory(null);
  };

  const handleCategoryToggle = (name) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  const handleAddFilterChip = () => {
    const value = query.trim();
    if (!value) return;

    if (!selectedCategories.includes(value)) {
      setSelectedCategories((prev) => [...prev, value]);
    }

    setQuery("");
  };

  const filteredCategories = useMemo(() => {
    const list = Array.isArray(categories) ? categories : [];
    return list.filter((category) => {
      const name = category?.name?.toLowerCase() || "";
      const queryMatch = query ? name.includes(query.toLowerCase()) : true;
      const selectedMatch = selectedCategories.length
        ? selectedCategories.some((item) => item.toLowerCase() === name)
        : true;
      return queryMatch && selectedMatch;
    });
  }, [categories, query, selectedCategories]);

  const categoryStats = useMemo(() => {
    const stats = new Map();
    (Array.isArray(expenses) ? expenses : []).forEach((expense) => {
      const name = expense.category || expense.label || expense.note || "Uncategorized";
      const entry = stats.get(name) || { total: 0, count: 0 };
      entry.total += expense.amount || 0;
      entry.count += 1;
      stats.set(name, entry);
    });
    return stats;
  }, [expenses]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount * rate);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Manage expense
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">Choose a category</h1>
            <p className="mt-2 text-sm text-slate-600">
              Select a category to log a new expense quickly.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowNewCategory((prev) => !prev)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Plus className="mr-1 inline h-3 w-3" />
            {showNewCategory ? "Close" : "New category"}
          </button>
        </div>

        {showNewCategory && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (newCategory.trim() === "") return;
              addCategory(newCategory.trim());
            }}
            className="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center"
          >
            <div className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
              <label className="text-[11px] font-semibold text-slate-500">Category name</label>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Transport, Food, Utilities"
                required
                className="mt-1 w-full bg-transparent text-sm text-slate-700 outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-[#f47d4a] px-4 py-2 text-xs font-semibold text-white hover:bg-[#e56f3d]"
            >
              Add category
            </button>
          </form>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Categories
            </p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">
              {filteredCategories.length} available
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddFilterChip();
                  }
                }}
                placeholder="Search categories"
                className="w-full bg-transparent text-sm text-slate-700 outline-none"
                list="expense-category-options"
              />
              <button
                type="button"
                onClick={handleAddFilterChip}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Add filter"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={async () => {
                await getCategories();
                toast({
                  title: "Synced",
                  description: "Categories refreshed.",
                });
              }}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              disabled={isLoading}
            >
              Sync
            </button>
          </div>
        </div>

        <datalist id="expense-category-options">
          {(Array.isArray(categories) ? categories : []).map((category) => (
            <option key={category._id || category.name} value={category.name} />
          ))}
        </datalist>

        <div className="mt-4 flex flex-wrap gap-2">
          {selectedCategories.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => handleCategoryToggle(name)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
            >
              {name} x
            </button>
          ))}
          {selectedCategories.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedCategories([])}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
              No categories found. Create a new one above.
            </div>
          ) : (
            filteredCategories.map((category) => {
              const Icon = iconArray[hashStringToIndex(category.name, iconArray.length)];
              const bgColor = colors[hashStringToIndex(category.name, colors.length)];
              const shadowColor = shadows[hashStringToIndex(category.name, shadows.length)];
              const stat = categoryStats.get(category.name) || { total: 0, count: 0 };
              const maxCategoryTotal = Math.max(
                ...Array.from(categoryStats.values()).map((value) => value.total || 0),
                1
              );
              const percent = Math.min((stat.total / maxCategoryTotal) * 100, 100);
              const paletteIndex = hashStringToIndex(category.name, colors.length);
              const barColor = colors[paletteIndex].replace("bg-", "bg-");
              return (
                <button
                  type="button"
                  key={category._id || category.name}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-orange-200 hover:bg-orange-50"
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bgColor} text-white shadow-lg ${shadowColor}`}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold text-slate-600">
                      {stat.count} entries
                    </span>
                  </div>
                  <p className="mt-4 text-base font-semibold text-slate-900">{category.name}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {stat.total > 0 ? `${formatCurrency(stat.total)} this month` : "No spend yet"}
                  </p>
                  <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
                    <div
                      className={`h-2 rounded-full ${barColor}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500">Tap to add</span>
                    <Link
                      to={`/dashboard/myexpense?category=${encodeURIComponent(category.name)}`}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      View expenses
                    </Link>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </section>

      {selectedCategory && (
        <AddSubCategoryForm
          category={selectedCategory}
          onAddSubCategory={handleAddSubCategory}
          onClose={closeForm}
        />
      )}
    </div>
  );
};

export default AddExpense;
