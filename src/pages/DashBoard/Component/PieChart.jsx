import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, options }) => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="w-full max-w-[260px] sm:max-w-[320px] md:max-w-[360px]">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default PieChart;
