"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Type สำหรับ order แต่ละตัว
interface Order {
  order_date: string;
  revenue: number;
  total_sale: number;
}

// Type สำหรับ grouped data
interface GroupedData {
  [label: string]: {
    revenue: number;
    total_sale: number;
  };
}

// Mock data
const mockOrdersData: Order[] = [
  { order_date: "2025-08-01", revenue: 1200, total_sale: 10 },
  { order_date: "2025-08-02", revenue: 1500, total_sale: 8 },
  { order_date: "2025-08-03", revenue: 700, total_sale: 4 },
  { order_date: "2025-08-04", revenue: 900, total_sale: 6 },
  { order_date: "2025-08-05", revenue: 2000, total_sale: 12 },
  { order_date: "2025-08-06", revenue: 1300, total_sale: 9 },
  { order_date: "2025-08-07", revenue: 1100, total_sale: 7 },
  { order_date: "2025-08-08", revenue: 1600, total_sale: 11 },
  { order_date: "2025-08-09", revenue: 900, total_sale: 5 },
  { order_date: "2025-08-10", revenue: 1200, total_sale: 9 },
  { order_date: "2025-08-11", revenue: 1400, total_sale: 10 },
  { order_date: "2025-08-12", revenue: 1800, total_sale: 13 },
  { order_date: "2025-09-01", revenue: 2000, total_sale: 15 },
  { order_date: "2025-09-05", revenue: 1700, total_sale: 12 },
  { order_date: "2025-09-10", revenue: 1900, total_sale: 14 },
  { order_date: "2025-10-02", revenue: 2200, total_sale: 18 },
  { order_date: "2025-10-10", revenue: 2500, total_sale: 20 },
  { order_date: "2024-07-15", revenue: 1000, total_sale: 8 },
  { order_date: "2024-12-20", revenue: 1500, total_sale: 12 },
];

export default function BarChartComponent() {
  const [ordersData, setOrdersData] = useState<Order[]>([]);
  const [timePeriod, setTimePeriod] = useState<"week" | "month" | "year">(
    "week"
  );

  useEffect(() => {
    setOrdersData(mockOrdersData);
  }, []);

  const groupByTimePeriod = (
    orders: Order[],
    period: "week" | "month" | "year"
  ): GroupedData => {
    const groupedData: GroupedData = {};

    orders.forEach((order) => {
      const orderDate = new Date(order.order_date);
      let label: string;

      if (period === "week") {
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        label = daysOfWeek[orderDate.getDay()];
      } else if (period === "month") {
        const monthNames = [
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
        label = monthNames[orderDate.getMonth()];
      } else {
        label = orderDate.getFullYear().toString();
      }

      if (!groupedData[label]) {
        groupedData[label] = { revenue: 0, total_sale: 0 };
      }
      groupedData[label].revenue += order.revenue;
      groupedData[label].total_sale += order.total_sale;
    });

    // สำหรับ week ให้เรียงลำดับวัน
    if (period === "week") {
      const orderedData: GroupedData = {};
      const daysOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      daysOrder.forEach((day) => {
        orderedData[day] = groupedData[day] || { revenue: 0, total_sale: 0 };
      });
      return orderedData;
    }

    return groupedData;
  };

  const groupedOrders = groupByTimePeriod(ordersData, timePeriod);
  const labels = Object.keys(groupedOrders);
  const revenueData = labels.map((label) => groupedOrders[label].revenue);

  const data = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: revenueData,
        backgroundColor: "#0088FE",
        borderColor: "#0088FE",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
    scales: {
      x: { title: { display: false } },
      y: {
        title: { display: false },
        min: 0,
        max: 10000,
        ticks: { stepSize: 2500 },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md mt-3 p-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="text-gray-400 text-xl">Revenue</p>
          <div className="flex items-center mt-1">
            <p className="text-3xl">$16,400.12</p>
            <div className="flex rounded ml-4">
              <div className="bg-green-100 flex h-6 items-center px-2 rounded">
                <img
                  src="/right-up.png"
                  alt="Right Up"
                  className="w-4 h-4 mr-1"
                />
                <p className="text-green-600 font-semibold">+10%</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <select
            className="px-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-700"
            value={timePeriod}
            onChange={(e) =>
              setTimePeriod(e.target.value as "week" | "month" | "year")
            }
          >
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>
      </div>

      <div className="w-full h-[15rem] mt-4 p-4 bg-white rounded-lg shadow-lg">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
