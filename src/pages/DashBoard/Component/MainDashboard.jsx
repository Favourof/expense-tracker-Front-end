import { useState, useEffect } from "react";
import { useGetTotalIncome } from "../hooks/useGetTotalIncome";
import { useGetAllIncome } from "../hooks/useGetAllIcome";
import { useGetExpenses } from "../hooks/useGetExpenses";
import useCurrencyConverter from "../hooks/useCurrencyConverter";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import PieChart from "./PieChart";
import { ArrowDownRight, ArrowUpRight, PiggyBank, Wallet2, TrendingUp } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

const MainDashboard = () => {
  const [monthlyIncome, setMonthlyIncome] = useState(0.0);
  const [monthlyExpense, setMonthlyExpense] = useState(0.0);
  const [showCurrency, setShowCurrency] = useState(false);
  const [trendMode, setTrendMode] = useState("weekly");
  const [hoverPoint, setHoverPoint] = useState(null);

  const {
    month,
    incomeData,
    expenseData,
    handleCurrencyChange,
    currency,
  } = useGetTotalIncome();
  const { allIncome, weeklyIncome } = useGetAllIncome();
  const { expenses, weeklyExpenses } = useGetExpenses();

  const conversionRate = useCurrencyConverter(currency);

  useEffect(() => {
    if (incomeData?.month === month) {
      setMonthlyIncome(incomeData.totalIncome);
      setMonthlyExpense(expenseData?.totalExpense || 0);
      localStorage.setItem("monthlyIncome", incomeData.totalIncome);
      localStorage.setItem("monthlyExpense", expenseData?.totalExpense || 0);
    } else {
      setMonthlyIncome(0.0);
      setMonthlyExpense(0.0);
    }
  }, [incomeData, month, expenseData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount * conversionRate);
  };

  const savingRate = monthlyIncome - monthlyExpense;
  const isDeficit = savingRate < 0;

  const calculateRate = () => {
    const total = monthlyIncome + monthlyExpense;
    if (total === 0) {
      return {
        incomeRate: "No data",
        expenseRate: "No data",
        savingRatePercentage: "No data",
      };
    }

    const incomeRate = ((monthlyIncome / total) * 100).toFixed(2);
    const expenseRate = ((monthlyExpense / total) * 100).toFixed(2);
    const savingRatePercentage = ((Math.abs(savingRate) / total) * 100).toFixed(2);

    return { incomeRate, expenseRate, savingRatePercentage };
  };

  const { incomeRate, expenseRate, savingRatePercentage } = calculateRate();

  const isSameDay = (a, b) => {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  const today = new Date();
  const todayIncomeTotal = (Array.isArray(allIncome) ? allIncome : [])
    .filter((income) => income?.date && isSameDay(new Date(income.date), today))
    .reduce((sum, income) => sum + (income.amount || 0), 0);

  const expenseActivity = (Array.isArray(expenses) ? expenses : []).map((expense) => ({
    id: expense._id || `${expense.label || "expense"}-${expense.date}`,
    type: "expense",
    title: expense.label || expense.note || "Expense",
    category: expense.label || expense.note || "Expense",
    amount: expense.amount || 0,
    date: expense.date,
  }));

  const todayExpenseTotal = expenseActivity
    .filter((item) => item?.date && isSameDay(new Date(item.date), today))
    .reduce((sum, item) => sum + (item.amount || 0), 0);

  const incomeActivity = (Array.isArray(allIncome) ? allIncome : []).map((income) => ({
    id: income._id || `${income.source}-${income.date}`,
    type: "income",
    title: income.source || "Income",
    category: "Income",
    amount: income.amount || 0,
    date: income.date,
  }));

  const recentActivity = [...incomeActivity, ...expenseActivity]
    .filter((item) => item?.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const expenseCategoryTotals = expenseActivity.reduce((acc, item) => {
    if (!item?.category) return acc;
    acc[item.category] = (acc[item.category] || 0) + (item.amount || 0);
    return acc;
  }, {});

  const topCategories = Object.entries(expenseCategoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const weeklyExpenseTotals = Array.from({ length: 5 }, (_, index) => {
    const match = weeklyExpenses.find((week) => week.week === `Week ${index + 1}`);
    return match?.amount || 0;
  });
  const weeklyIncomeTotals = Array.from({ length: 5 }, (_, index) => {
    const match = weeklyIncome.find((week) => week.week === `Week ${index + 1}`);
    return match?.amount || 0;
  });
  const last7Days = Array.from({ length: 7 }, (_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - idx));
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const dailyIncomeTotals = last7Days.map((day) =>
    incomeActivity
      .filter((item) => item?.date && isSameDay(new Date(item.date), day))
      .reduce((sum, item) => sum + (item.amount || 0), 0)
  );
  const dailyExpenseTotals = last7Days.map((day) =>
    expenseActivity
      .filter((item) => item?.date && isSameDay(new Date(item.date), day))
      .reduce((sum, item) => sum + (item.amount || 0), 0)
  );

  const trendIncome = trendMode === "weekly" ? weeklyIncomeTotals : dailyIncomeTotals;
  const trendExpense = trendMode === "weekly" ? weeklyExpenseTotals : dailyExpenseTotals;
  const trendLabels =
    trendMode === "weekly"
      ? Array.from({ length: 5 }, (_, index) => `W${index + 1}`)
      : last7Days.map((d) =>
          new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(d)
        );

  const maxTrend = Math.max(...trendIncome, ...trendExpense, 1);
  const sparkWidth = 140;
  const sparkHeight = 56;

  const buildSparkPoints = (values) => {
    if (!values.length) return "";
    const step = sparkWidth / (values.length - 1 || 1);
    return values
      .map((value, index) => {
        const x = index * step;
        const y = sparkHeight - (value / maxTrend) * sparkHeight;
        return `${x},${y}`;
      })
      .join(" ");
  };

  const incomeSparkPoints = buildSparkPoints(trendIncome);
  const expenseSparkPoints = buildSparkPoints(trendExpense);

  const data = {
    labels: ["Monthly Income", "Monthly Expense", isDeficit ? "Deficit" : "Saving Rate"],
    datasets: [
      {
        label: "Income vs Expense vs Saving",
        data: [
          Math.max(monthlyIncome * conversionRate, 0),
          Math.max(monthlyExpense * conversionRate, 0),
          Math.max(Math.abs(savingRate) * conversionRate, 0),
        ],
        backgroundColor: ["#3878F0", "#F06C1C", isDeficit ? "#FF0000" : "#4CAF50"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384", isDeficit ? "#FF6347" : "#66BB6A"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Dashboard overview
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 lg:text-3xl">
              Your money flow for {monthLabel}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Track income and expenses, understand spending patterns, and keep your savings on
              track.
            </p>
          </div>
          <div className="w-full max-w-sm">
            <button
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-700 md:hidden"
              onClick={() => setShowCurrency((prev) => !prev)}
              type="button"
            >
              <span>Preferences</span>
              <span className="text-xs text-slate-500">Currency: {currency}</span>
            </button>
            <div
              className={`mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 ${
                showCurrency ? "block" : "hidden"
              } md:block`}
            >
              <label htmlFor="currency" className="block text-xs font-semibold text-slate-500">
                Preferred currency
              </label>
              <select
                id="currency"
                name="currency"
                value={currency}
                onChange={handleCurrencyChange}
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0b3b2e]"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="JPY">JPY</option>
                <option value="GBP">GBP</option>
                <option value="NGN">NGN</option>
              </select>
              <p className="mt-2 text-xs text-slate-500">
                Converted values are shown across all charts.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-2 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 xl:grid-cols-4">
        <div className="min-w-[240px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Income</p>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">
            {formatCurrency(monthlyIncome)}
          </p>
          <p className="mt-2 text-sm text-slate-600">Monthly total income</p>
        </div>
        <div className="min-w-[240px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Expenses</p>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-orange-600">
              <ArrowDownRight className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">
            {formatCurrency(monthlyExpense)}
          </p>
          <p className="mt-2 text-sm text-slate-600">Monthly total expenses</p>
        </div>
        <div className="min-w-[240px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {isDeficit ? "Deficit" : "Net savings"}
            </p>
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full ${
                isDeficit ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
              }`}
            >
              <Wallet2 className="h-4 w-4" />
            </span>
          </div>
          <p
            className={`mt-3 text-2xl font-semibold ${
              isDeficit ? "text-red-500" : "text-emerald-600"
            }`}
          >
            {formatCurrency(Math.abs(savingRate))}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            {isDeficit ? "You spent more than you earned." : "Saved after expenses."}
          </p>
        </div>
        <div className="min-w-[240px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Saving rate</p>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <PiggyBank className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">
            {savingRatePercentage === "No data" ? "No data" : `${savingRatePercentage}%`}
          </p>
          <p className="mt-2 text-sm text-slate-600">Share of income saved</p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.4fr,1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Today</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">
                Daily money snapshot
              </h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short" }).format(today)}
            </span>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Today&apos;s income
              </p>
              <p className="mt-3 text-xl font-semibold text-emerald-900">
                {formatCurrency(todayIncomeTotal)}
              </p>
              <p className="mt-1 text-xs text-emerald-700">Keep it steady.</p>
            </div>
            <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
                Today&apos;s expense
              </p>
              <p className="mt-3 text-xl font-semibold text-orange-900">
                {formatCurrency(todayExpenseTotal)}
              </p>
              <p className="mt-1 text-xs text-orange-700">Track every spend.</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => (window.location.href = "/dashboard/income")}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Add income
            </button>
            <button
              type="button"
              onClick={() => (window.location.href = "/dashboard/addExpense")}
              className="rounded-full bg-[#f47d4a] px-4 py-2 text-xs font-semibold text-white hover:bg-[#e56f3d]"
            >
              Add expense
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Recent activity
              </p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">Latest updates</h2>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-slate-500">
                No recent activity yet. Add your first income or expense.
              </p>
            ) : (
              recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500">
                      {item.type === "income" ? "Income" : item.category} -{" "}
                      {new Intl.DateTimeFormat("en-US", {
                        day: "numeric",
                        month: "short",
                      }).format(new Date(item.date))}
                    </p>
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      item.type === "income" ? "text-emerald-600" : "text-orange-600"
                    }`}
                  >
                    {item.type === "income" ? "+" : "-"}
                    {formatCurrency(item.amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Spending balance
              </p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">
                Income vs expenses breakdown
              </h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {monthLabel}
            </span>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-[1.2fr,1fr]">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Composition</p>
              <div className="mt-3 h-3 w-full rounded-full bg-white">
                <div className="flex h-full overflow-hidden rounded-full">
                  <div
                    className="h-full bg-emerald-500"
                    style={{
                      width:
                        incomeRate === "No data" ? "0%" : `${Math.min(Number(incomeRate), 100)}%`,
                    }}
                  />
                  <div
                    className="h-full bg-orange-400"
                    style={{
                      width:
                        expenseRate === "No data" ? "0%" : `${Math.min(Number(expenseRate), 100)}%`,
                    }}
                  />
                  <div
                    className={`h-full ${isDeficit ? "bg-red-400" : "bg-slate-300"}`}
                    style={{
                      width:
                        savingRatePercentage === "No data"
                          ? "0%"
                          : `${Math.min(Math.abs(Number(savingRatePercentage)), 100)}%`,
                    }}
                  />
                </div>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Income
                  </span>
                  <span className="font-semibold text-slate-900">
                    {incomeRate === "No data" ? "0%" : `${incomeRate}%`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-orange-400" />
                    Expenses
                  </span>
                  <span className="font-semibold text-slate-900">
                    {expenseRate === "No data" ? "0%" : `${expenseRate}%`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isDeficit ? "bg-red-400" : "bg-slate-300"
                      }`}
                    />
                    {isDeficit ? "Deficit" : "Savings"}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {savingRatePercentage === "No data" ? "0%" : `${savingRatePercentage}%`}
                  </span>
                </div>
              </div>
              <div className="mt-4 grid gap-2 text-xs text-slate-600 sm:grid-cols-3">
                <div className="min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2">
                  <p className="text-slate-500">Income</p>
                  <p className="truncate font-semibold text-slate-900">{formatCurrency(monthlyIncome)}</p>
                </div>
                <div className="min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2">
                  <p className="text-slate-500">Expenses</p>
                  <p className="truncate font-semibold text-slate-900">{formatCurrency(monthlyExpense)}</p>
                </div>
                <div className="min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2">
                  <p className="text-slate-500">{isDeficit ? "Deficit" : "Savings"}</p>
                  <p className="truncate font-semibold text-slate-900">
                    {formatCurrency(Math.abs(savingRate))}
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <PieChart data={data} options={options} />
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">This month focus</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">Budget health</h3>
          <div className="mt-4 space-y-4 text-sm text-slate-600">
            <div>
              <div className="flex items-center justify-between">
                <span>Income vs expenses</span>
                <span className="font-semibold text-slate-900">
                  {savingRatePercentage === "No data" ? "0%" : `${savingRatePercentage}%`}
                </span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                <div
                  className={`h-2 rounded-full ${isDeficit ? "bg-red-400" : "bg-emerald-500"}`}
                  style={{
                    width:
                      savingRatePercentage === "No data"
                        ? "0%"
                        : `${Math.min(Math.abs(Number(savingRatePercentage)), 100)}%`,
                  }}
                />
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Insight</p>
              <p className="mt-1 text-sm text-slate-600">
                {isDeficit
                  ? "Expenses are above income. Consider tightening discretionary categories."
                  : "You are saving consistently. Consider setting a target for next month."}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Next action</p>
              <p className="mt-1 text-sm text-slate-600">
                Update income and expense entries to keep weekly insights accurate.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr,1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Top categories</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">Where money goes</h3>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {topCategories.length === 0 ? (
              <p className="text-sm text-slate-500">No expenses yet this month.</p>
            ) : (
              topCategories.map(([category, amount]) => (
                <span
                  key={category}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
                >
                  {category}: {formatCurrency(amount)}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Weekly trend</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">Income vs expense rhythm</h3>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-slate-100 p-1 text-xs font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => setTrendMode("weekly")}
                className={`rounded-full px-3 py-1 ${trendMode === "weekly" ? "bg-white text-slate-900" : ""}`}
              >
                Weekly
              </button>
              <button
                type="button"
                onClick={() => setTrendMode("daily")}
                className={`rounded-full px-3 py-1 ${trendMode === "daily" ? "bg-white text-slate-900" : ""}`}
              >
                Daily
              </button>
            </div>
          </div>
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{trendMode === "weekly" ? "Weekly pattern" : "Daily pattern"}</span>
              <span>{trendMode === "weekly" ? "W1 - W5" : "Last 7 days"}</span>
            </div>
            <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <svg viewBox={`0 0 ${sparkWidth} ${sparkHeight}`} className="h-20 w-full">
                <line x1="0" y1={sparkHeight} x2={sparkWidth} y2={sparkHeight} stroke="#e2e8f0" strokeWidth="1" />
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={incomeSparkPoints}
                />
                <polyline
                  fill="none"
                  stroke="#fb923c"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={expenseSparkPoints}
                />
                {trendIncome.map((value, index) => {
                  const x = (sparkWidth / (trendIncome.length - 1 || 1)) * index;
                  const y = sparkHeight - (value / maxTrend) * sparkHeight;
                  return (
                    <circle
                      key={`in-dot-${index}`}
                      cx={x}
                      cy={y}
                      r="2.6"
                      fill="#10b981"
                      onMouseEnter={() =>
                        setHoverPoint({
                          x,
                          y,
                          label: trendLabels[index],
                          type: "Income",
                          value,
                          color: "#10b981",
                        })
                      }
                      onMouseLeave={() => setHoverPoint(null)}
                      onClick={() =>
                        setHoverPoint({
                          x,
                          y,
                          label: trendLabels[index],
                          type: "Income",
                          value,
                          color: "#10b981",
                        })
                      }
                    />
                  );
                })}
                {trendExpense.map((value, index) => {
                  const x = (sparkWidth / (trendExpense.length - 1 || 1)) * index;
                  const y = sparkHeight - (value / maxTrend) * sparkHeight;
                  return (
                    <circle
                      key={`ex-dot-${index}`}
                      cx={x}
                      cy={y}
                      r="2.6"
                      fill="#fb923c"
                      onMouseEnter={() =>
                        setHoverPoint({
                          x,
                          y,
                          label: trendLabels[index],
                          type: "Expense",
                          value,
                          color: "#fb923c",
                        })
                      }
                      onMouseLeave={() => setHoverPoint(null)}
                      onClick={() =>
                        setHoverPoint({
                          x,
                          y,
                          label: trendLabels[index],
                          type: "Expense",
                          value,
                          color: "#fb923c",
                        })
                      }
                    />
                  );
                })}
                {hoverPoint && (
                  <>
                    <rect
                      x={Math.min(hoverPoint.x + 4, sparkWidth - 70)}
                      y={Math.max(hoverPoint.y - 24, 4)}
                      width="66"
                      height="20"
                      rx="6"
                      fill="white"
                      stroke="#e2e8f0"
                    />
                    <text
                      x={Math.min(hoverPoint.x + 8, sparkWidth - 66)}
                      y={Math.max(hoverPoint.y - 10, 16)}
                      fontSize="8"
                      fill="#0f172a"
                    >
                      {hoverPoint.label}
                    </text>
                    <text
                      x={Math.min(hoverPoint.x + 8, sparkWidth - 66)}
                      y={Math.max(hoverPoint.y + 2, 26)}
                      fontSize="8"
                      fill={hoverPoint.color}
                    >
                      {hoverPoint.type}: {formatCurrency(hoverPoint.value)}
                    </text>
                  </>
                )}
              </svg>
              <div
                className={`mt-3 grid text-[10px] text-slate-400 ${
                  trendLabels.length === 5 ? "grid-cols-5" : "grid-cols-7"
                }`}
              >
                {trendLabels.map((label) => (
                  <span key={label} className="text-center">
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Income
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-400" />
                Expense
              </span>
              <span className="ml-auto text-[11px] text-slate-400">
                Max: {formatCurrency(maxTrend)}
              </span>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Compares weekly income and expense rhythm for the current month.
          </p>
        </div>
      </section>
    </div>
  );
};

export default MainDashboard;
