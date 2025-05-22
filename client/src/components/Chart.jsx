import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export const BarChart = ({ users = 1, jobs, applications }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    // Create new chart instance
    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Users", "Jobs", "Applications"],
        datasets: [
          {
            data: [users, jobs, applications],
            backgroundColor: [
              "rgba(59, 130, 246, 0.8)", // Blue
              "rgba(16, 185, 129, 0.8)", // Green
              "rgba(139, 92, 246, 0.8)", // Purple
            ],
            borderColor: [
              "rgba(59, 130, 246, 1)",
              "rgba(16, 185, 129, 1)",
              "rgba(139, 92, 246, 1)",
            ],
            borderWidth: 2,
            hoverOffset: 15,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 20,
              font: {
                size: 14,
                family: "'Inter', sans-serif",
              },
              color: "#374151",
            },
          },
          tooltip: {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            titleColor: "#1F2937",
            bodyColor: "#4B5563",
            borderColor: "#E5E7EB",
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              },
            },
          },
        },
        cutout: "60%",
        animation: {
          animateScale: true,
          animateRotate: true,
        },
      },
    });

    // Cleanup function to destroy chart when component unmounts
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [users, jobs, applications]);

  return <canvas ref={chartRef} />;
};
