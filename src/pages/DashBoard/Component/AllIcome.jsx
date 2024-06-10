import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import AnimatedForm from './AnimatedForm';
import { Button } from '@/components/ui/button';
import { useGetAllIncome } from '../hooks/useGetAllIcome';
import { useGetTotalIncome } from '../hooks/useGetTotalIncome';
// import { Progress } from '@radix-ui/react-progress';

const AllIcome = () => {
  const { currency, formatDate, handleStartDateChange, handleEndDateChange, endDate, startDate } = useGetTotalIncome();
  const { allIncome } = useGetAllIncome();
  const [monthlyIncome, setmonthlyIncome] = useState(localStorage.getItem('monthlyIncome'));

  // Sort allIncome by date in descending order (most recent first)
  

 
  const filteredIncome = allIncome.filter((income) => {
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
  });

  let sortedIncome = filteredIncome.slice().sort((a, b) => new Date(b.date) - new Date(a.date));





  return (
    <div>
      <div className='flex space-between gap-5 relative z-10'>
        <h3 className="text-lg font-semibold text-gray-800">Income List</h3>
        <Popover className='w-[400px]'>
          <Button className='bg-orange-500'>
            <PopoverTrigger>Add Income</PopoverTrigger>
          </Button>
          <PopoverContent>
            <AnimatedForm />
          </PopoverContent>
        </Popover>

        
      </div>

      {/* <div className="flex space-between gap-5 mt-4">
        <div>
          <label className="block text-gray-600">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-600">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div> */}
  <div className="mt-8 flex flex-col items-center space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4 md:space-x-6 lg:space-x-8 relative z-0">
  <div className='relative z-0'>
    <label className="block text-gray-600">Start Date</label>
    <DatePicker
      selected={startDate}
      onChange={handleStartDateChange}
      className="px-3 py-2 border border-gray-300 rounded-lg"
      placeholderText="Select start date"
    />
  </div>
  <div>
    <label className="block text-gray-600">End Date</label>
    <DatePicker
      selected={endDate}
      onChange={handleEndDateChange}
      className="px-3 py-2 border border-gray-300 rounded-lg"
      placeholderText="Select end date"
    />
  </div>
</div>



      <div className="bg-white p-6">
        {sortedIncome.length === 0 ? (
          <p className="text-gray-600">No income entries available.</p>
        ) : (
          <ul>
           {sortedIncome.map((income) => {
  const percentage = (income.amount / monthlyIncome ) * 100;

  return (
    <li key={income._id} className="mb-4 shadow-md rounded-xl p-6 hover:bg-orange-200">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg font-semibold text-gray-800">{income.source}</p>
          <p className="text-sm text-gray-600">
            {new Intl.DateTimeFormat(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
              hour12: true,
            }).format(new Date(income.date))}
          </p>
          <p className="text-sm text-gray-600">
            Week {income.weekOfMonth}
          </p>
          <p className="text-sm text-red-600">
            {formatDate(income.date)}
          </p>
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-800">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: currency,
            }).format(income.amount)}
          </p>
        
          <div className="mt-2 w-full h-2 bg-gray-200 rounded">
            <div className="h-full bg-orange-500 rounded" style={{ width: `${percentage}%` }} />
            <p className='text-sm'>{percentage.toString().slice(0, 4)}% of your Income</p>

          </div>
        </div>
      </div>
    </li>
  );
})}

          </ul>
        )}
      </div>
    </div>
  );
};

export default AllIcome;
