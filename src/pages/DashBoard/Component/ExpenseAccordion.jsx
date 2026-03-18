import React from 'react';
import { useGetExpenses } from '../hooks/useGetExpenses';
import { GiExpense } from "react-icons/gi";
import { useGetTotalIncome } from '../hooks/useGetTotalIncome';
import Loader from './Loader';
import { useCurrency } from "@/context/CurrencyContext";

const iconArray = [GiExpense];

const hashStringToIndex = (str, arrayLength) => {
  if (!str) return 0; // Default to index 0 if str is undefined or null
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % arrayLength;
};

const ExpenseAccordion = () => {
  const { expenses, isLoading } = useGetExpenses();
  const { formatDate } = useGetTotalIncome();
  const { currency, rate: cov } = useCurrency();

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center">
       <Loader />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {expenses.map((expense, index) => {
        if (!expense?.categories || expense.categories.length === 0) {
          return (
            <div
              key={expense._id || index}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {expense.label || expense.note || "Expense"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Intl.DateTimeFormat(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }).format(new Date(expense.date))}
                  </p>
                </div>
                <p className="text-sm font-semibold text-orange-600">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency,
                  }).format(expense.amount * cov)}
                </p>
              </div>
            </div>
          );
        }

        return (
          <details key={index} className="rounded-2xl border border-slate-200 bg-white p-4">
            <summary className="flex cursor-pointer items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
                  {React.createElement(iconArray[hashStringToIndex(expense.category, iconArray.length)])}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Expense group</p>
                  <p className="text-xs text-slate-500">Expand to view categories</p>
                </div>
              </div>
              <span className="text-xs text-slate-400">Toggle</span>
            </summary>
            <div className="mt-4 space-y-3">
              {expense.categories && expense.categories.length > 0 && expense.categories.map((category, catIndex) => (
                <details key={catIndex} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <summary className="flex cursor-pointer items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-400 text-white">
                      {React.createElement(iconArray[hashStringToIndex(category.name, iconArray.length)])}
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{category.name}</p>
                  </summary>
                  <div className="mt-3 space-y-3">
                    {category.subCategories && category.subCategories.length > 0 && category.subCategories
                      .slice()
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((subCategory, subIndex) => (
                        <div key={subIndex} className="rounded-xl border border-slate-200 bg-white p-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{subCategory.name}</p>
                              <p className="text-xs text-slate-500">{subCategory.description}</p>
                              <p className="text-xs text-slate-500">
                                {new Intl.DateTimeFormat(undefined, {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: 'numeric',
                                  minute: 'numeric',
                                  hour12: true,
                                }).format(new Date(subCategory.date))}
                              </p>
                              <p className="text-xs text-red-500">{formatDate(subCategory.date)}</p>
                            </div>
                            <div className="text-sm font-semibold text-slate-900">
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency,
                              }).format(subCategory.amount * cov)}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </details>
              ))}
            </div>
          </details>
        );
      })}
    </div>
  );
};

export default ExpenseAccordion;
