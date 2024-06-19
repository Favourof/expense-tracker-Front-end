// PieChart.js
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, incomeRate, expenseRate, savingRatePercentage }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="mt-8  flex flex-col items-center justify-between space-y-8 md:flex-row md:space-y-0 md:space-x-8 lg:space-x-16 w-full max-w-screen-lg mx-auto">
    <div className="flex justify-center w-full md:w-1/2 lg:w-1/3">
      <Pie data={data} options={options} className="w-[200px] sm:w-[300px] md:w-[350px] lg:w-[400px]" />
    </div>
    <div className="mt-4 text-center md:mt-0 md:text-left w-full md:w-1/2 lg:w-1/3">
      <p className="text-lg text-gray-700">Monthly Income is <strong>{incomeRate}%</strong> of the total.</p>
      <p className="text-lg text-gray-700">Monthly Expense is <strong>{expenseRate}%</strong> of the total.</p>
      <p className="text-lg text-gray-700">Monthly Saving is <strong>{savingRatePercentage}%</strong> of the total.</p>
    </div>
  </div>
  );
};

export default PieChart;
