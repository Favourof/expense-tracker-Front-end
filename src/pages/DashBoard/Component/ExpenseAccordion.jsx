import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  // CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useGetExpenses } from '../hooks/useGetExpenses';
import { FaTshirt, FaAppleAlt, FaCar, FaHome, FaShoppingCart, FaQuestion } from 'react-icons/fa';
import { GiExpense } from "react-icons/gi";
import { MdOutlineEmojiTransportation } from "react-icons/md";
import { useGetTotalIncome } from '../hooks/useGetTotalIncome';
import Loader from './Loader';


const iconArray = [   GiExpense];

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
  const [expanded, setExpanded] = useState(false);
  const { formatDate } = useGetTotalIncome();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center">
       <Loader />
      </div>
    );
  }

  return (
    <div className="w-full">
      {expenses.map((expense, index) => (
        <Accordion
          key={index}
          expanded={expanded === `panel${index}`}
          onChange={handleChange(`panel${index}`)}
          className="mb-4"
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}bh-content`}
            id={`panel${index}bh-header`}
            className="bg-green-400 p-3 rounded-md"
          >
            <div className="flex items-center">
              <div className="bg-green-400 rounded-full h-10 w-10  flex items-center justify-center text-white">
                {React.createElement(iconArray[hashStringToIndex(expense.category, iconArray.length)])}
              </div>
              <Typography className="ml-3 p-5 text-orange-600">My Expense</Typography>
            </div>
          </AccordionSummary>
          <AccordionDetails className="bg-gray-100 p-3 rounded-md">
            <div className="w-full">
              {expense.categories && expense.categories.length > 0 && expense.categories.map((category, catIndex) => (
                <Accordion key={catIndex} className="mb-2">
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index}-${catIndex}bh-content`}
                    id={`panel${index}-${catIndex}bh-header`}
                    className="bg-gray-300 p-2 rounded-md"
                  >
                    <div className="flex items-center">
                      <div className="bg-orange-400 rounded-full h-10 w-10 flex items-center justify-center text-white">
                        {React.createElement(iconArray[hashStringToIndex(category.name, iconArray.length)])}
                      </div>
                      <Typography className="ml-2 font-bold text-5xl text-green-700 p-5">{category.name}</Typography>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails className="bg-gray-50 p-2 rounded-md">
                    <div className="w-full">
                      {category.subCategories && category.subCategories.length > 0 && category.subCategories
                        .slice() // Create a copy of the array
                        .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date in descending order
                        .map((subCategory, subIndex) => (
                          <div key={subIndex} className="mb-4 shadow-md rounded-xl p-6 hover:bg-orange-200 cursor-pointer">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-lg font-semibold text-gray-800">{subCategory.name}</p>
                                <p className="text-sm text-gray-600">{subCategory.description}</p>
                                <p className="text-sm text-gray-600">
                                  {new Intl.DateTimeFormat(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    second: 'numeric',
                                    hour12: true,
                                  }).format(new Date(subCategory.date))}
                                </p>
                                <p className="text-sm text-red-600">
                                  {formatDate(subCategory.date)}
                                </p>
                              </div>
                              <div>
                                <p className="text-lg font-semibold text-gray-800">
                                  {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: localStorage.getItem('currency'), // Replace with your currency logic
                                  }).format(subCategory.amount * localStorage.getItem('cov'))}
                                </p>
                                <div className="mt-2 w-full h-2 bg-gray-200 rounded">
                                  {/* Optional percentage bar */}
                                  {/* <div className="h-full bg-orange-500 rounded" style={{ width: `${percentage}%` }} />
                                  <p className='text-sm'>{percentage.toFixed(2)}% of category</p> */}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default ExpenseAccordion;
