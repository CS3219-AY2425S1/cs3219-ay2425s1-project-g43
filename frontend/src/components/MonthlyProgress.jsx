import { useRef, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const MonthlyProgress = ({ monthlyPracticeData, startMonth }) => {
  const chartRef = useRef(null);

  const generateMonthLabels = (startMonth) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const labels = [];
    for (let i = 0; i < 6; i++) {
      labels.push(months[(startMonth + i) % 12]);
    }
    return labels;
  };

  const data = {
    labels: generateMonthLabels(startMonth),
    datasets: [
      {
        label: "Practice Sessions",
        data: monthlyPracticeData.slice(0, 6),
        backgroundColor: "#bcfe4d",
        borderRadius: 8,
        barPercentage: 0.8,
        hoverBackgroundColor: "#84cc16",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: "white",
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "#333",
          borderDash: [5, 5],
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const index = tooltipItem.dataIndex;
            const label = monthlyPracticeData[index];
            return `Practice Sessions: ${label}`;
          },
        },
        backgroundColor: "#2c3e50",
        titleColor: "#ecf0f1",
        bodyColor: "#ecf0f1",
      },
    },
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-gray-300/30 bg-[#191919] p-6">
      <h2 className="mb-4 text-lg font-semibold text-white">
        Monthly Practice Breakdown
      </h2>
      <div className="h-64">
        <Bar ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
};

export default MonthlyProgress;
