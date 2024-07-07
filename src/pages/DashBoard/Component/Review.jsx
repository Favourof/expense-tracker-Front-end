import React, { useState, useRef } from 'react';
import ExpenseReview from "./ExpenseReview";
import IncomeReview from "./IncomeReview";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { TailSpin } from 'react-loader-spinner';

const Review = () => {
  const [isLoading, setIsLoading] = useState(false);
  const reviewRef = useRef();

  const handleDownloadPdf = () => {
    setIsLoading(true);
    const input = reviewRef.current;
    html2canvas(input, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("review.pdf");
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  };

  // const monthName = startDate ? getMonthName(startDate) : 'Selected Period';

  return (
    <div>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <TailSpin
            height="80"
            width="80"
            color="white"
            ariaLabel="loading"
          />
        </div>
      )}
      <div className="mt-8 p-6 bg-white shadow-md rounded-lg" ref={reviewRef}>
        <div className="flex justify-end mb-4">
          <button 
            onClick={handleDownloadPdf} 
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Download as PDF
          </button>
        </div>
        <IncomeReview />
        <ExpenseReview />
      </div>
    </div>
  );
};

export default Review;
