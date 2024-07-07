import { useState, useEffect } from "react";
import { useGetTotalIncome } from "../hooks/useGetTotalIncome";
import useCurrencyConverter from "../hooks/useCurrencyConverter"; // Import the hook
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import PieChart from "./PieChart";

ChartJS.register(ArcElement, Tooltip, Legend);

const MainDashboard = () => {
  const [monthlyIncome, setMonthlyIncome] = useState(0.00);
  const [monthlyExpense, setMonthlyExpense] = useState(0.00);

  const { 
    month, 
    incomeData, 
    expenseData, 
    handleCurrencyChange, 
    currency 
  } = useGetTotalIncome();

  const conversionRate = useCurrencyConverter(currency); // Use the hook

  useEffect(() => {
    if (incomeData?.month === month) {
      setMonthlyIncome(incomeData.totalIncome);
      setMonthlyExpense(expenseData?.totalExpense || 0);
      localStorage.setItem('monthlyIncome', incomeData.totalIncome);
      localStorage.setItem('monthlyExpense', expenseData?.totalExpense || 0);
    } else {
      setMonthlyIncome(0.00);
      setMonthlyExpense(0.00);
    } 
  }, [incomeData, month]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount * conversionRate);
  };

  const savingRate = (monthlyIncome - monthlyExpense);
  const isDeficit = savingRate < 0;

  const data = {
    labels: ["Monthly Income", "Monthly Expense", isDeficit ? "Deficit" : "Saving Rate"],
    datasets: [
      {
        label: "Income vs Expense vs Saving",
        data: [monthlyIncome * conversionRate, monthlyExpense * conversionRate, Math.abs(savingRate) * conversionRate],
        backgroundColor: ["#3878F0", "#F06C1C", isDeficit ? "#FF0000" : "#4CAF50"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384", isDeficit ? "#FF6347" : "#66BB6A"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const calculateRate = () => {
    if (monthlyIncome === 0 && monthlyExpense === 0) return { incomeRate: "No data", expenseRate: "No data", savingRatePercentage: "No data" };
    const total = monthlyIncome + monthlyExpense + Math.abs(savingRate);
    const incomeRate = ((monthlyIncome / total) * 100).toFixed(2);
    const expenseRate = ((monthlyExpense / total) * 100).toFixed(2);
    const savingRatePercentage = ((Math.abs(savingRate) / total) * 100).toFixed(2);
    return { incomeRate, expenseRate, savingRatePercentage };
  };

  const { incomeRate, expenseRate, savingRatePercentage } = calculateRate();

  return (
    <div>
      <div className="mt-8 shadow-md rounded-md p-4">
        <label htmlFor="currency" className="block font-bold text-2xl mb-3 text-blue-500">Select Currency</label>
        <select
          id="currency"
          name="currency"
          value={currency}
          onChange={handleCurrencyChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="JPY">JPY</option>
          <option value="GBP">GBP</option>
          <option value="NGN">NGN</option>
        </select>
      </div>
      
      <h1 className="mt-5 text-2xl font-bold text-orange-500">Monthly Overview</h1>
      <div className="mt-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="relative flex flex-col bg-white text-gray-700 shadow-md rounded-xl">
          <div className="bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40 shadow-lg absolute -mt-4 mx-4 rounded-xl overflow-hidden grid h-16 w-16 place-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-6 h-6 text-white">
              <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd"></path>
              <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.04a.75.75 0 10.39-1.45A53.224 53.224 0 002.25 18z" />
            </svg>
          </div>
          <div className="p-4 text-right">
            <p className="block text-sm text-blue-gray-600">Monthly Income</p>
            <h4 className="block text-2xl font-semibold text-blue-gray-900">{formatCurrency(monthlyIncome)}</h4>
          </div>
          <div className="border-t border-blue-gray-50 p-4">
            <p className="text-base text-blue-gray-600">
              <strong className="text-green-500">+10%</strong>&nbsp;than last week
            </p>
          </div>
        </div>
        <div className="relative flex flex-col bg-white text-gray-700 shadow-md rounded-xl">
          <div className="bg-gradient-to-tr from-orange-600 to-orange-400 text-white shadow-orange-500/40 shadow-lg absolute -mt-4 mx-4 rounded-xl overflow-hidden grid h-16 w-16 place-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-6 h-6 text-white">
              <path fillRule="evenodd" d="M7.125 1.5A2.625 2.625 0 004.5 4.125v15.75A2.625 2.625 0 007.125 22.5h9.75a2.625 2.625 0 002.625-2.625V4.125A2.625 2.625 0 0016.875 1.5h-9.75zm2.625 3a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75zm-.25 11.625c0-.414.336-.75.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75zm-.75-4.875a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75z" clipRule="evenodd"></path>
            </svg>
          </div>
          <div className="p-4 text-right">
            <p className="block text-sm text-blue-gray-600">Monthly Expense</p>
            <h4 className="block text-2xl font-semibold text-blue-gray-900">{formatCurrency(monthlyExpense)}</h4>
          </div>
          <div className="border-t border-blue-gray-50 p-4">
            <p className="text-base text-blue-gray-600">
              <strong className="text-red-500">-14%</strong>&nbsp;than last week
            </p>
          </div>
        </div>
        <div className="relative flex flex-col bg-white text-gray-700 shadow-md rounded-xl">
          <div className={`bg-gradient-to-tr ${isDeficit ? 'from-red-600 to-red-400' : 'from-green-600 to-green-400'} text-white shadow-lg absolute -mt-4 mx-4 rounded-xl overflow-hidden grid h-16 w-16 place-items-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-6 h-6 text-white">
              <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v4.44l2.628 2.628a.75.75 0 01-1.06 1.061l-3-3a.75.75 0 01-.22-.53V4.5A.75.75 0 0112 3.75zm-8.25 8.25a.75.75 0 01.75-.75h4.44l2.628-2.628a.75.75 0 111.061 1.06l-3 3a.75.75 0 01-.53.22H4.5a.75.75 0 01-.75-.75zm16.5 0a.75.75 0 00-.75-.75h-4.44l-2.628-2.628a.75.75 0 10-1.061 1.06l3 3a.75.75 0 00.53.22h4.44a.75.75 0 00.75-.75zm-8.25 8.25a.75.75 0 00-.75-.75v-4.44l-2.628-2.628a.75.75 0 10-1.061 1.061l3 3a.75.75 0 00.53.22h4.44a.75.75 0 00.75-.75z" clipRule="evenodd"></path>
            </svg>
          </div>
          <div className="p-4 text-right">
            <p className="block text-sm text-blue-gray-600">{isDeficit ? "Deficit" : "Saving Rate"}</p>
            <h4 className="block text-2xl font-semibold text-blue-gray-900">{formatCurrency(Math.abs(savingRate))}</h4>
          </div>
          <div className="border-t border-blue-gray-50 p-4">
            <p className="text-base text-blue-gray-600">
              <strong className={isDeficit ? "text-red-500" : "text-green-500"}>{isDeficit ? "-10%" : "+10%"}</strong>&nbsp;than last week
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 shadow-lg rounded-md p-4">
        <p className="font-bold text-2xl text-gray-500">Pie chart</p>
        <PieChart data={data} options={options} incomeRate={incomeRate} expenseRate={expenseRate} savingRatePercentage={savingRatePercentage} />
      </div>
    </div>
  );
};

export default MainDashboard;
