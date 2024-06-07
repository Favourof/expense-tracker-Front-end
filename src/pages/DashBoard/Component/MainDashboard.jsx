// import { useState, useEffect } from "react";
// import { useGetTotalIncome } from "../hooks/useGetTotalIncome";

// const MainDashboard = () => {
//   const [monthlyIncome, setMonthlyIncome] = useState(0.00);
//   const [montlyExpense, setmontlyExpense] = useState(0.00);

//   const { month, incomeData, expenseData, handleCurrencyChange, currency } = useGetTotalIncome();

//   useEffect(() => {
//     if (incomeData?.month === month) {
//       setMonthlyIncome(incomeData.totalIncome);
//       setmontlyExpense(expenseData?.totalExpense)
//       console.log(expenseData);
//     } else {
//       setMonthlyIncome(0.00);
//     }
//   }, [incomeData, month]);




//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: currency,
//     }).format(amount);
//   };

//   return (
//     <div>
//        <div className="mt-8 shadow-md rounded-md">
//           <label htmlFor="currency" className="block  font-bold text-2xl mb-3 text-blue-500 ">Select Currency</label>
//           <select
//             id="currency"
//             name="currency"
//             value={currency}
//             onChange={handleCurrencyChange}
//             className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
//           >
//             <option value="USD">USD</option>
//             <option value="EUR">EUR</option>
//             <option value="JPY">JPY</option>
//             <option value="GBP">GBP</option>
//             <option value="NGN">NGN</option>
//           </select>
//         </div>
//         <h1 className="mt-5 text-2xl text-pretty font-bold text-orange-500">Expense</h1>
//       <div className="mt-12">
       
//         <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
//           <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
//             <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-6 h-6 text-white">
//                 <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd"></path>
//                 <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z"></path>
//               </svg>
//             </div>
//             <div className="p-4 text-right">
//               <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">Monthly Income</p>
//               <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{formatCurrency(monthlyIncome)}</h4>
//             </div>
//             <div className="border-t border-blue-gray-50 p-4">
//               <p className="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
//                 <strong className="text-green-500">+55%</strong>&nbsp;than last week
//               </p>
//             </div>
//           </div>
//           <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
//             <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-orange-600 to-orange-400 text-white shadow-orange-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-6 h-6 text-white">
//                 <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z"></path>
//               </svg>
//             </div>
//             <div className="p-4 text-right">
//               <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">Monthly Expense</p>
//               <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{formatCurrency(montlyExpense)}</h4>
//             </div>
//             <div className="border-t border-blue-gray-50 p-4">
//               <p className="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
//                 <strong className="text-green-500">+5%</strong>&nbsp;than yesterday
//               </p>
//             </div>
//           </div>
//         </div>
       
//       </div>
//     </div>
//   );
// }

// export default MainDashboard;

import { useState, useEffect } from "react";
import { useGetTotalIncome } from "../hooks/useGetTotalIncome";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const MainDashboard = () => {
  const [monthlyIncome, setMonthlyIncome] = useState(0.00);
  const [monthlyExpense, setMonthlyExpense] = useState(0.00);

  const { month, incomeData, expenseData, handleCurrencyChange, currency } = useGetTotalIncome();

  useEffect(() => {
    if (incomeData?.month === month) {
      setMonthlyIncome(incomeData.totalIncome);
      setMonthlyExpense(expenseData?.totalExpense || 0);
      console.log(expenseData);
    } else {
      setMonthlyIncome(0.00);
      setMonthlyExpense(0.00);
    }
  }, [incomeData, month]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const data = {
    labels: ["Monthly Income", "Monthly Expense"],
    datasets: [
      {
        label: "Income vs Expense",
        data: [monthlyIncome, monthlyExpense],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
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
    if (monthlyIncome === 0 && monthlyExpense === 0) return "No data";
    const total = monthlyIncome + monthlyExpense;
    const incomeRate = ((monthlyIncome / total) * 100).toFixed(2);
    const expenseRate = ((monthlyExpense / total) * 100).toFixed(2);
    return { incomeRate, expenseRate };
  };

  const { incomeRate, expenseRate } = calculateRate();

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
              <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z"></path>
            </svg>
          </div>
          <div className="p-4 text-right">
            <p className="block text-sm text-blue-gray-600">Monthly Income</p>
            <h4 className="block text-2xl font-semibold text-blue-gray-900">{formatCurrency(monthlyIncome)}</h4>
          </div>
          <div className="border-t border-blue-gray-50 p-4">
            <p className="text-base text-blue-gray-600">
              <strong className="text-green-500">+55%</strong>&nbsp;than last week
            </p>
          </div>
        </div>
        <div className="relative flex flex-col bg-white text-gray-700 shadow-md rounded-xl">
          <div className="bg-gradient-to-tr from-orange-600 to-orange-400 text-white shadow-orange-500/40 shadow-lg absolute -mt-4 mx-4 rounded-xl overflow-hidden grid h-16 w-16 place-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-6 h-6 text-white">
              <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z"></path>
            </svg>
          </div>
          <div className="p-4 text-right">
            <p className="block text-sm text-blue-gray-600">Monthly Expense</p>
            <h4 className="block text-2xl font-semibold text-blue-gray-900">{formatCurrency(monthlyExpense)}</h4>
          </div>
          <div className="border-t border-blue-gray-50 p-4">
            <p className="text-base text-blue-gray-600">
              <strong className="text-green-500">+5%</strong>&nbsp;than yesterday
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 w-1/2 ">
        <Pie data={data} options={options} className="w-[200px] mx-auto" />
        <div className="mt-4 text-center">
          <p className="text-lg text-gray-700">Monthly Income is <strong>{incomeRate}%</strong> of the total.</p>
          <p className="text-lg text-gray-700">Monthly Expense is <strong>{expenseRate}%</strong> of the total.</p>
        </div>
      </div>
    </div>
  );
}

export default MainDashboard;
