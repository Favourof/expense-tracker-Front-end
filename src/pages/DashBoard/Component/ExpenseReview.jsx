import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { useGetExpenses } from '../hooks/useGetExpenses';

const ExpenseReview = () => {
  const { weeklyExpenses, isLoading } = useGetExpenses();
  const [monthlyExpense, setMonthlyExpense] = useState(parseFloat(localStorage.getItem('monthlyExpense')) || 0);
  const [cov, setCov] = useState(parseFloat(localStorage.getItem('cov')) || 1);
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'USD');
  const [data, setData] = useState([]);

  useEffect(() => {
    if (weeklyExpenses.length > 0) {
      const chartData = weeklyExpenses.map((expense, index) => ({
        name: expense.week,
        Expense: parseFloat((expense.amount * cov).toFixed(1)),
        'Monthly Expense': parseFloat((monthlyExpense * cov).toFixed(1)),
      }));
      setData(chartData);
    }
  }, [weeklyExpenses, monthlyExpense]);

  const getMonthName = (date) => {
    const options = { month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
  };

  const monthName = getMonthName(new Date());

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-8 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Weekly Expense Review for {monthName}</h2>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Expenses for Each Week:</h3>
          <ul className="space-y-2">
            {weeklyExpenses.map((expense, index) => (
              <li key={index} className="text-gray-600 flex justify-between items-center bg-gray-100 p-3 rounded-md">
                <span>{expense.week}</span>
                <span className="font-medium text-gray-800">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: currency,
                  }).format(expense.amount * cov)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full lg:w-1/2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="name" tick={{ fill: '#555' }} />
              <YAxis tick={{ fill: '#555' }} />
              <Tooltip contentStyle={{ backgroundColor: '#f9f9f9', border: '1px solid #ccc' }} />
              <Legend />
              <Bar dataKey="Expense" fill="#FF7F50" radius={[10, 10, 0, 0]}>
                <LabelList dataKey="Expense" position="top" style={{ fill: '#FF7F50', fontWeight: 'bold' }} />
              </Bar>
              <Bar dataKey="Monthly Expense" fill="#4682B4" radius={[10, 10, 0, 0]}>
                {/* <LabelList dataKey="Monthly Expense" position="top" style={{ fill: '#4682B4', fontWeight: 'bold' }} /> */}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ExpenseReview;
