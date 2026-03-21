import React, { useMemo, useState, useEffect, useRef } from "react";
import ExpenseAccordion from "./ExpenseAccordion";
import { useGetExpenses } from "../hooks/useGetExpenses";
import { useGetTotalIncome } from "../hooks/useGetTotalIncome";
import { useCurrency } from "@/context/CurrencyContext";
import { CalendarDays, Search, ChevronDown } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import DetailDrawer from "@/components/shared/DetailDrawer";
import { apiClient } from "@/shared/api/request";
import { useToast } from "@/components/ui/use-toast";
import { useFinance } from "@/context/FinanceContext";

const MyExpense = () => {
  const { expenses, isLoading } = useGetExpenses();
  const { expenseData, formatDate } = useGetTotalIncome();
  const { currency, rate } = useCurrency();
  const { onExpenseMutated } = useFinance();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const searchRef = useRef(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editForm, setEditForm] = useState({ amount: "", note: "", date: "" });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setQuery(categoryParam);
    }
  }, [searchParams]);

  const filterOptions = useMemo(() => {
    const set = new Set();
    (Array.isArray(expenses) ? expenses : []).forEach((expense) => {
      if (expense?.category) set.add(expense.category);
      if (expense?.subcategory) set.add(expense.subcategory);
      if (expense?.label) set.add(expense.label);
      if (expense?.note) set.add(expense.note);
    });
    return Array.from(set);
  }, [expenses]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
      amount * rate
    );

  useEffect(() => {
    if (!selectedExpense) return;
    setIsEditing(false);
    setEditForm({
      amount: selectedExpense.amount ?? "",
      note: selectedExpense.note || selectedExpense.label || "",
      date: selectedExpense.date
        ? new Date(selectedExpense.date).toISOString().slice(0, 16)
        : "",
    });
  }, [selectedExpense]);

  const handleSaveEdit = async () => {
    if (!selectedExpense?._id) return;
    setIsSaving(true);
    try {
      await apiClient.patch(`/expense/${selectedExpense._id}`, {
        amount: Number(editForm.amount),
        note: editForm.note,
        date: editForm.date ? new Date(editForm.date).toISOString() : undefined,
      });
      await onExpenseMutated();
      toast({ title: "Updated", description: "Expense updated successfully." });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update expense.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteExpense = async () => {
    if (!selectedExpense?._id) return;
    const ok = window.confirm("Delete this expense?");
    if (!ok) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/expense/${selectedExpense._id}`);
      await onExpenseMutated();
      toast({ title: "Deleted", description: "Expense removed." });
      setSelectedExpense(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete expense.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFilterToggle = (value) => {
    setSelectedFilters((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleAddFilterChip = () => {
    const value = query.trim();
    if (!value) return;
    if (!selectedFilters.includes(value)) {
      setSelectedFilters((prev) => [...prev, value]);
    }
    setQuery("");
  };

  const filteredExpenses = useMemo(() => {
    return (Array.isArray(expenses) ? expenses : []).filter((expense) => {
      const label = (expense.label || expense.note || "").toLowerCase();
      const category = (expense.category || "").toLowerCase();
      const subcategory = (expense.subcategory || "").toLowerCase();
      const needle = query.toLowerCase();
      const matchesQuery = query
        ? label.includes(needle) || category.includes(needle) || subcategory.includes(needle)
        : true;
      const matchesSelected = selectedFilters.length
        ? selectedFilters.some((item) => {
            const check = item.toLowerCase();
            return label.includes(check) || category.includes(check) || subcategory.includes(check);
          })
        : true;
      const date = expense?.date ? new Date(expense.date) : null;
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      const matchesStart = start && date ? date >= start : true;
      const matchesEnd = end && date ? date <= end : true;
      return matchesQuery && matchesSelected && matchesStart && matchesEnd;
    });
  }, [expenses, query, selectedFilters, startDate, endDate]);

  const totalExpense = expenseData?.totalExpense || 0;
  const today = new Date();
  const startOfWeek = new Date();
  startOfWeek.setDate(today.getDate() - 6);
  startOfWeek.setHours(0, 0, 0, 0);
  const todayExpense = filteredExpenses
    .filter((item) => item?.date && new Date(item.date).toDateString() === today.toDateString())
    .reduce((sum, item) => sum + (item.amount || 0), 0);
  const weekExpense = filteredExpenses
    .filter((item) => item?.date && new Date(item.date) >= startOfWeek)
    .reduce((sum, item) => sum + (item.amount || 0), 0);

  const categoryTotals = useMemo(() => {
    const map = new Map();
    filteredExpenses.forEach((item) => {
      const key = item.category || item.label || item.note || "Uncategorized";
      map.set(key, (map.get(key) || 0) + (item.amount || 0));
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [filteredExpenses]);

  const maxCategoryTotal = Math.max(...categoryTotals.map((entry) => entry[1]), 1);

  const daysInMonth = new Date().getDate();
  const dailyAverage = totalExpense / Math.max(daysInMonth, 1);

  const topLabels = useMemo(() => {
    const counts = {};
    filteredExpenses.forEach((expense) => {
      const key = expense.label || expense.note || "General";
      counts[key] = (counts[key] || 0) + (expense.amount || 0);
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [filteredExpenses]);


  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Expenses
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              Expense tracker
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Stay on top of your spending and spot patterns early.
            </p>
          </div>
          <button
            type="button"
            onClick={() => (window.location.href = "/dashboard/addExpense")}
            className="rounded-full bg-[#f47d4a] px-4 py-2 text-xs font-semibold text-white hover:bg-[#e56f3d]"
          >
            Add expense
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Monthly spend
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {formatCurrency(totalExpense)}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Daily average
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {formatCurrency(dailyAverage)}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Spent today
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {formatCurrency(todayExpense)}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Last 7 days
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {formatCurrency(weekExpense)}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Top categories
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {topLabels.length === 0 ? (
                <span className="text-xs text-slate-500">No data yet</span>
              ) : (
                topLabels.map(([label, amount]) => (
                  <span
                    key={label}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700"
                  >
                    {label}: {formatCurrency(amount)}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr,2fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Filters
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500">Search</label>
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
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
                  placeholder="Bills, transport, food"
                  className="w-full bg-transparent text-sm text-slate-700 outline-none"
                  list="expense-filter-options"
                  ref={searchRef}
                />
                <button
                  type="button"
                  className="text-slate-400 hover:text-slate-600"
                  onClick={() => searchRef.current?.focus()}
                  aria-label="Show filter options"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <datalist id="expense-filter-options">
                {filterOptions.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedFilters.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleFilterToggle(item)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    {item} x
                  </button>
                ))}
                {selectedFilters.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedFilters([])}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {filterOptions.map((item) => (
                  <button
                    key={`option-${item}`}
                    type="button"
                    onClick={() => handleFilterToggle(item)}
                    className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${
                      selectedFilters.includes(item)
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Start date</label>
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                <CalendarDays className="h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-700 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">End date</label>
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                <CalendarDays className="h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-700 outline-none"
                />
              </div>
            </div>
            {(query || startDate || endDate || selectedFilters.length > 0) && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setStartDate("");
                  setEndDate("");
                  setSelectedFilters([]);
                }}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Expense list</h3>
            <span className="text-xs text-slate-500">
              {filteredExpenses.length} entries
            </span>
          </div>
          <div className="mt-4 max-h-[520px] overflow-y-auto pr-1">
            <ExpenseAccordion
              expenses={filteredExpenses}
              isLoading={isLoading}
              formatDate={formatDate}
              currency={currency}
              rate={rate}
              onSelect={(expense) => setSelectedExpense(expense)}
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Category breakdown
            </p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">
              Where money goes
            </h3>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {categoryTotals.length === 0 ? (
            <p className="text-sm text-slate-500">No expense data to show.</p>
          ) : (
            categoryTotals.map(([name, amount]) => (
              <div key={name} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between text-sm text-slate-700">
                  <span className="font-semibold">{name}</span>
                  <span className="text-slate-500">{formatCurrency(amount)}</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-white">
                  <div
                    className="h-2 rounded-full bg-orange-400"
                    style={{ width: `${(amount / maxCategoryTotal) * 100}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <DetailDrawer
        isOpen={Boolean(selectedExpense)}
        onClose={() => setSelectedExpense(null)}
        header={
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Expense detail</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                {selectedExpense?.category || selectedExpense?.label || "Expense"}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {selectedExpense?.date
                  ? new Intl.DateTimeFormat(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    }).format(new Date(selectedExpense.date))
                  : "—"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                onClick={() => setIsEditing((prev) => !prev)}
              >
                {isEditing ? "Cancel edit" : "Edit"}
              </button>
              <button
                className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                onClick={handleDeleteExpense}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                onClick={() => setSelectedExpense(null)}
              >
                Close
              </button>
            </div>
          </div>
        }
      >
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Amount</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {selectedExpense ? formatCurrency(selectedExpense.amount || 0) : "—"}
          </p>
          <p className="mt-1 text-xs text-slate-500">Recorded in NGN, shown in your preferred currency</p>
        </div>

        {isEditing ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Edit expense</p>
            <div className="mt-3 grid gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                <label className="text-[11px] font-semibold text-slate-500">Note</label>
                <input
                  value={editForm.note}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, note: e.target.value }))}
                  className="mt-1 w-full bg-transparent text-sm text-slate-700 outline-none"
                  placeholder="Transport, food, etc."
                />
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                <label className="text-[11px] font-semibold text-slate-500">Amount (NGN)</label>
                <input
                  type="number"
                  value={editForm.amount}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, amount: e.target.value }))}
                  className="mt-1 w-full bg-transparent text-sm text-slate-700 outline-none"
                />
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                <label className="text-[11px] font-semibold text-slate-500">Date</label>
                <input
                  type="datetime-local"
                  value={editForm.date}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, date: e.target.value }))}
                  className="mt-1 w-full bg-transparent text-sm text-slate-700 outline-none"
                />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-full bg-[#f47d4a] px-4 py-2 text-xs font-semibold text-white hover:bg-[#e56f3d] disabled:opacity-60"
                onClick={handleSaveEdit}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-sm text-slate-700">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
              <span className="text-slate-500">Category</span>
              <span className="font-semibold">{selectedExpense?.category || "—"}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
              <span className="text-slate-500">Subcategory</span>
              <span className="font-semibold">{selectedExpense?.subcategory || "—"}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
              <span className="text-slate-500">Note</span>
              <span className="font-semibold">{selectedExpense?.note || selectedExpense?.label || "—"}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
              <span className="text-slate-500">Date</span>
              <span className="font-semibold">
                {selectedExpense?.date ? formatDate(selectedExpense.date) : "—"}
              </span>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
};

export default MyExpense;
