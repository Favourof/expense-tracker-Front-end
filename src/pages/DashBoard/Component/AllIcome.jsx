import React, { useEffect, useMemo, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Loader from './Loader';
import { useGetTotalIncome } from '../hooks/useGetTotalIncome';
import { useGetAllIncome } from '../hooks/useGetAllIcome';
import { CalendarDays, Filter, Plus, Search, ChevronDown } from "lucide-react";
import IncomeForm from "@/components/income/IncomeForm";
import IncomeBottomSheet from "@/components/income/IncomeBottomSheet";
import { apiClient } from "@/shared/api/request";
import { useCurrency } from "@/context/CurrencyContext";
import DetailDrawer from "@/components/shared/DetailDrawer";
import { useFinance } from "@/context/FinanceContext";


const AllIncome = () => {
  const DatePickerInput = DatePicker?.default ?? DatePicker;
  const { currency, formatDate, handleStartDateChange, handleEndDateChange, endDate, startDate } = useGetTotalIncome();
  const { rate: convert } = useCurrency();
  const { onIncomeMutated } = useFinance();
  const { allIncome, handleGetAllIncome, isLoading } = useGetAllIncome();
  const [monthlyIncome, setMonthlyIncome] = useState(localStorage.getItem('monthlyIncome'));
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editForm, setEditForm] = useState({ source: "", amount: "", date: "" });
  const [query, setQuery] = useState("");
  const [selectedSources, setSelectedSources] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [insights, setInsights] = useState(null);
  const searchRef = useRef(null);

  const filteredIncome = useMemo(() => allIncome.filter((income) => {
    const incomeDate = new Date(income.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && end) {
      return incomeDate >= start && incomeDate <= end;
    } else if (start) {
      return incomeDate >= start;
    } else if (end) {
      return incomeDate <= end;
    } else {
      return true; // No filtering if no dates are selected
    }
  }).filter((income) => {
    const source = income.source?.toLowerCase() || "";
    const queryMatch = query ? source.includes(query.toLowerCase()) : true;
    const sourceMatch = selectedSources.length
      ? selectedSources.some((s) => s.toLowerCase() === source)
      : true;
    return queryMatch && sourceMatch;
  }), [allIncome, startDate, endDate, query, selectedSources]);

  const sortedIncome = filteredIncome.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  const sourceOptions = useMemo(() => {
    const set = new Set();
    allIncome.forEach((income) => {
      if (income?.source) set.add(income.source);
    });
    return Array.from(set);
  }, [allIncome]);

  const handleSourceToggle = (source) => {
    setSelectedSources((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]
    );
  };

  const handleAddSourceChip = () => {
    const value = query.trim();
    if (!value) return;
    if (!selectedSources.includes(value)) {
      setSelectedSources((prev) => [...prev, value]);
    }
    setQuery("");
  };

  const fetchInsights = async () => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const response = await apiClient.get(`/income/summary/${year}/${month}/insights`);
      if (response?.data) {
        setInsights(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getWeekOfMonth = (dateValue) => {
    if (!dateValue) return null;
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return null;
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const startDay = start.getDay();
    return Math.ceil((date.getDate() + startDay) / 7);
  };

  const handleIncomeClick = (income, index) => {
    setSelectedIncome(income);
    setSelectedIndex(index);
  };

  const handlePrevIncome = () => {
    if (selectedIndex <= 0) return;
    const nextIndex = selectedIndex - 1;
    setSelectedIndex(nextIndex);
    setSelectedIncome(sortedIncome[nextIndex]);
  };

  const handleNextIncome = () => {
    if (selectedIndex >= sortedIncome.length - 1) return;
    const nextIndex = selectedIndex + 1;
    setSelectedIndex(nextIndex);
    setSelectedIncome(sortedIncome[nextIndex]);
  };

  useEffect(() => {
    if (!selectedIncome) return;
    setIsEditing(false);
    setEditForm({
      source: selectedIncome.source || "",
      amount: selectedIncome.amount ?? "",
      date: selectedIncome.date
        ? new Date(selectedIncome.date).toISOString().slice(0, 16)
        : "",
    });
  }, [selectedIncome]);

  const handleEditChange = (key, value) => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveEdit = async () => {
    if (!selectedIncome?._id) return;
    setIsSaving(true);
    try {
      const payload = {
        amount: Number(editForm.amount),
        note: editForm.source,
        date: editForm.date ? new Date(editForm.date).toISOString() : undefined,
      };
      await apiClient.patch(`/income/${selectedIncome._id}`, payload);
      await onIncomeMutated();
      await fetchInsights();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteIncome = async () => {
    if (!selectedIncome?._id) return;
    const ok = window.confirm("Delete this income entry?");
    if (!ok) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/income/${selectedIncome._id}`);
      await onIncomeMutated();
      await fetchInsights();
      setSelectedIncome(null);
      setSelectedIndex(-1);
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);


  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Income</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">Income ledger</h1>
            <p className="mt-2 text-sm text-slate-600">
              Track every inflow and understand where your money comes from.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="hidden rounded-full bg-[#f47d4a] px-4 py-2 text-xs font-semibold text-white hover:bg-[#e56f3d] md:inline-flex"
              onClick={() => setIsAdding((prev) => !prev)}
            >
              <Plus className="mr-1 inline h-3 w-3" /> {isAdding ? "Close" : "Add income"}
            </button>
            <div className="md:hidden">
              <IncomeBottomSheet
                triggerLabel={
                  <span className="inline-flex items-center">
                    <Plus className="mr-1 inline h-3 w-3" /> Add income
                  </span>
                }
                triggerClassName="rounded-full bg-[#f47d4a] px-4 py-2 text-xs font-semibold text-white hover:bg-[#e56f3d]"
                onSuccess={() => {
                  onIncomeMutated();
                  fetchInsights();
                }}
              />
            </div>
          </div>
        </div>
        {insights && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total income
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: currency,
                }).format((insights.totalIncome || 0) * convert)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Month change
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {insights.monthChangePercent === null ? "No data" : `${insights.monthChangePercent}%`}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Top source
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {insights.topSources?.[0]?.source || "No data"}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Weekly avg
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: currency,
                }).format(
                  (insights.weeklySummaries || []).reduce((sum, w) => sum + (w.totalIncome || 0), 0) /
                    Math.max((insights.weeklySummaries || []).length || 1, 1) *
                    convert
                )}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Largest income
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {insights.largestIncome
                  ? new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: currency,
                    }).format((insights.largestIncome.amount || 0) * convert)
                  : "No data"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {insights.largestIncome?.source || "Income"}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Consistency
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {insights.activeDaysThisMonth || 0}/{insights.daysInMonth || 0} days
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {insights.last14DaysActive || 0} days active in last 14
              </p>
            </div>
          </div>
        )}
        {insights?.topSources?.length ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Top sources
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {insights.topSources.map((source) => (
                <span
                  key={source.source}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700"
                >
                  {source.source}:{" "}
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: currency,
                  }).format((source.total || 0) * convert)}
                </span>
              ))}
            </div>
            <div className="mt-3 text-right">
              <button
                className="text-xs font-semibold text-[#f47d4a] hover:underline"
                onClick={() => setShowBreakdown((prev) => !prev)}
              >
                {showBreakdown ? "Hide breakdown" : "View full breakdown"}
              </button>
            </div>
          </div>
        ) : null}
        {showBreakdown && insights?.topSources?.length ? (
          <div className="mt-3 grid gap-2">
            {insights.topSources.map((source) => {
              const percent = insights.totalIncome
                ? (source.total / insights.totalIncome) * 100
                : 0;
              return (
                <div
                  key={`breakdown-${source.source}`}
                  className="rounded-2xl border border-slate-200 bg-white p-3"
                >
                  <div className="flex items-center justify-between text-sm text-slate-700">
                    <span className="font-semibold">{source.source}</span>
                    <span className="text-slate-500">{percent.toFixed(1)}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: currency,
                    }).format((source.total || 0) * convert)}
                  </p>
                </div>
              );
            })}
          </div>
        ) : null}
        {isAdding && (
          <div className="mt-6 hidden md:block">
            <IncomeForm
              onSuccess={() => {
                onIncomeMutated();
                fetchInsights();
                setIsAdding(false);
              }}
              onClose={() => setIsAdding(false)}
              className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr,1fr,auto]"
            />
          </div>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr,2fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Filter className="h-4 w-4" /> Filters
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500">Search source</label>
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSourceChip();
                    }
                  }}
                  placeholder="Salary, trade, freelancing"
                  className="w-full bg-transparent text-sm text-slate-700 outline-none"
                  list="income-source-options"
                  ref={searchRef}
                />
                <button
                  type="button"
                  className="text-slate-400 hover:text-slate-600"
                  onClick={() => searchRef.current?.focus()}
                  aria-label="Show source options"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <datalist id="income-source-options">
                {sourceOptions.map((source) => (
                  <option key={source} value={source} />
                ))}
              </datalist>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedSources.map((source) => (
                  <button
                    key={source}
                    type="button"
                    onClick={() => handleSourceToggle(source)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    {source} ×
                  </button>
                ))}
                {selectedSources.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedSources([])}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {sourceOptions.map((source) => (
                  <button
                    key={source}
                    type="button"
                    onClick={() => handleSourceToggle(source)}
                    className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${
                      selectedSources.includes(source)
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {source}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Start date</label>
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                <CalendarDays className="h-4 w-4 text-slate-400" />
                <DatePickerInput
                  selected={startDate}
                  onChange={handleStartDateChange}
                  className="w-full bg-transparent text-sm text-slate-700 outline-none"
                  placeholderText="Select start date"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">End date</label>
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                <CalendarDays className="h-4 w-4 text-slate-400" />
                <DatePickerInput
                  selected={endDate}
                  onChange={handleEndDateChange}
                  className="w-full bg-transparent text-sm text-slate-700 outline-none"
                  placeholderText="Select end date"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-slate-900">Income list</h3>
            <span className="text-xs text-slate-500">
              {sortedIncome.length} entries
            </span>
          </div>
          <div className="mt-4 max-h-[420px] overflow-y-auto pr-1">
            {isLoading ? (
              <Loader />
            ) : sortedIncome.length === 0 ? (
              <p className="text-sm text-slate-500">
                No income found for this period.
              </p>
            ) : (
              <ul className="space-y-3">
                {sortedIncome.map((income, index) => {
                  const percentage = monthlyIncome ? (income.amount / monthlyIncome) * 100 : 0;
                  return (
                    <li
                      key={income._id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-orange-200 hover:bg-orange-50"
                      onClick={() => handleIncomeClick(income, index)}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-base font-semibold text-slate-900">{income.source}</p>
                          <p className="text-xs text-slate-500">
                            {new Intl.DateTimeFormat(undefined, {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: true,
                            }).format(new Date(income.date))}
                          </p>
                          <p className="text-xs text-slate-500">{formatDate(income.date)}</p>
                        </div>
                        <div className="min-w-[160px] text-right">
                          <p className="text-base font-semibold text-slate-900">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: currency,
                            }).format(income.amount * convert)}
                          </p>
                          <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                            <div
                              className="h-2 rounded-full bg-orange-400"
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                          <p className="mt-1 text-[11px] text-slate-500">
                            {percentage.toFixed(2)}% of monthly income
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </section>

      <DetailDrawer
        isOpen={Boolean(selectedIncome)}
        onClose={() => setSelectedIncome(null)}
        header={
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Income detail</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">{selectedIncome?.source}</h3>
              <p className="mt-1 text-sm text-slate-500">
                {selectedIncome?.date
                  ? new Intl.DateTimeFormat(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    }).format(new Date(selectedIncome.date))
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
                onClick={handleDeleteIncome}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                onClick={() => setSelectedIncome(null)}
              >
                Close
              </button>
            </div>
          </div>
        }
        footer={
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevIncome}
              disabled={selectedIndex <= 0}
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 disabled:opacity-50"
            >
              Previous
            </button>
            <p className="text-xs text-slate-400">
              {selectedIndex + 1} of {sortedIncome.length}
            </p>
            <button
              type="button"
              onClick={handleNextIncome}
              disabled={selectedIndex >= sortedIncome.length - 1}
              className="rounded-full bg-[#f47d4a] px-4 py-2 text-xs font-semibold text-white hover:bg-[#e56f3d] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        }
      >
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Amount</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {selectedIncome
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: currency,
                }).format(selectedIncome.amount * convert)
              : "—"}
          </p>
          <p className="mt-1 text-xs text-slate-500">Recorded in NGN, shown in your preferred currency</p>
        </div>

        {isEditing ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Edit income</p>
            <div className="mt-3 grid gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                <label className="text-[11px] font-semibold text-slate-500">Source</label>
                <input
                  value={editForm.source}
                  onChange={(e) => handleEditChange("source", e.target.value)}
                  className="mt-1 w-full bg-transparent text-sm text-slate-700 outline-none"
                  placeholder="Salary, trade, freelance"
                />
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                <label className="text-[11px] font-semibold text-slate-500">Amount (NGN)</label>
                <input
                  type="number"
                  value={editForm.amount}
                  onChange={(e) => handleEditChange("amount", e.target.value)}
                  className="mt-1 w-full bg-transparent text-sm text-slate-700 outline-none"
                />
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                <label className="text-[11px] font-semibold text-slate-500">Date</label>
                <input
                  type="datetime-local"
                  value={editForm.date}
                  onChange={(e) => handleEditChange("date", e.target.value)}
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
              <span className="text-slate-500">Date</span>
              <span className="font-semibold">
                {selectedIncome ? formatDate(selectedIncome.date) : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
              <span className="text-slate-500">Week of month</span>
              <span className="font-semibold">
                {selectedIncome && getWeekOfMonth(selectedIncome.date)
                  ? `W${getWeekOfMonth(selectedIncome.date)}`
                  : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
              <span className="text-slate-500">Source</span>
              <span className="font-semibold">{selectedIncome?.source || "—"}</span>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-xs text-slate-600">
          Tip: Use the filters to compare this income with similar sources.
        </div>
      </DetailDrawer>
    </div>
  );
};

export default AllIncome;
