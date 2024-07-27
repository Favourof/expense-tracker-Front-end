import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AnimatedForm from './AnimatedForm';
import { Button } from '@/components/ui/button';
import Loader from './Loader';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { useGetTotalIncome } from '../hooks/useGetTotalIncome';
import { useGetAllIncome } from '../hooks/useGetAllIcome';


const AllIncome = () => {
  const { currency, formatDate, handleStartDateChange, handleEndDateChange, endDate, startDate } = useGetTotalIncome();
  const { allIncome, handleGetAllIncome, isLoading, error } = useGetAllIncome();
  const [monthlyIncome, setMonthlyIncome] = useState(localStorage.getItem('monthlyIncome'));
  const [convert, setConvert] = useState(localStorage.getItem('cov'));
  const [selectedIncome, setSelectedIncome] = useState(null);

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

  const sortedIncome = filteredIncome.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleIncomeClick = (income) => {
    setSelectedIncome(income);
  };

  const DialogOverlay = motion(Dialog.Overlay);
  const DialogContent = motion(Dialog.Content);
  const DialogTitle = motion(Dialog.Title);
  const DialogDescription = motion(Dialog.Description);
  const DialogClose = motion(Dialog.Close);

  return (
    <div>
      <div className='flex justify-between gap-5 fixed right-3 top-5 z-50 rounded-md  text-white bg-orange-400'>
        <AnimatedForm onSuccess={handleGetAllIncome} />
      </div>

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
        <h3 className="text-lg font-semibold text-gray-800 ">Income List</h3>
        {isLoading ? (
          <Loader />
        ) : sortedIncome.length === 0 ? (
          <p className="text-gray-600">No income data found for the selected period.</p>
        ) : (
          <ul>
            {sortedIncome.map((income) => {
              const percentage = (income.amount / monthlyIncome) * 100;

              return (
                <li key={income._id} className="mb-4 shadow-md rounded-xl p-6 hover:bg-orange-200 cursor-pointer" onClick={() => handleIncomeClick(income)}>
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
                        }).format(income.amount * convert)}
                      </p>

                      <div className="mt-2 w-full h-2 bg-gray-200 rounded">
                        <div className="h-full bg-orange-500 rounded" style={{ width: `${percentage}%` }} />
                        <p className='text-sm'>{percentage.toFixed(2)}% of your Income</p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {selectedIncome && (
        <Dialog.Root open={selectedIncome !== null} onOpenChange={() => setSelectedIncome(null)}>
          <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
          <DialogContent className="fixed inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto"
            >
              <DialogTitle className="text-xl font-bold mb-4">Income Details</DialogTitle>
              <DialogDescription className="text-gray-700 mb-4">
                More information about the selected income.
              </DialogDescription>
              <p><strong>Source:</strong> {selectedIncome.source}</p>
              <p><strong>Date:</strong> {formatDate(selectedIncome.date)}</p>
              <p><strong>Week of Month:</strong> {selectedIncome.weekOfMonth}</p>
              <p><strong>Amount:</strong> {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency,
              }).format(selectedIncome.amount * convert )}</p>
              <div className="mt-4 flex justify-end">
                <DialogClose asChild>
                  <Button className="bg-orange-500">Close</Button>
                </DialogClose>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog.Root>
      )}
    </div>
  );
};

export default AllIncome;
