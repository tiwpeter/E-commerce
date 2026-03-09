"use client";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

// Registering necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// Function สำหรับคำนวณเปอร์เซ็นต์
const calculatePercentage = (value, total) => {
    return ((value / total) * 100).toFixed(2);
};

// Mock data สำหรับ Pie Chart
const mockSalesData = [
    { category_name: "Electronics", total_sales: 1200 },
    { category_name: "Clothing", total_sales: 800 },
    { category_name: "Shoes", total_sales: 500 },
    { category_name: "Accessories", total_sales: 300 },
    { category_name: "Books", total_sales: 200 },
];

export default function PieChartComponent() {
    const [salesData, setSalesData] = useState(null);

    // ใช้ mock data แทนการเรียก API
    useEffect(() => {
        setSalesData(mockSalesData);
    }, []);

    // ถ้ายังไม่มีข้อมูลให้แสดงข้อความ Loading
    if (!salesData) {
        return <div>Loading...</div>;
    }

    // ข้อมูลที่ใช้ใน Doughnut Chart
    const data = {
        labels: salesData.map(item => item.category_name),
        datasets: [
            {
                label: "Sales by Category",
                data: salesData.map(item => item.total_sales),
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                ],
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                ],
            },
        ],
    };

    // Options สำหรับ Doughnut Chart
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                enabled: false,
            },
            legend: {
                position: "right",
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    generateLabels: (chart) => {
                        const dataset = chart.data.datasets[0];
                        const total = dataset.data.reduce((acc, val) => acc + val, 0);

                        return chart.data.labels.map((label, index) => {
                            const value = dataset.data[index];
                            const percentage = calculatePercentage(value, total);

                            return {
                                text: `${label} - ${percentage}%`,
                                fillStyle: dataset.backgroundColor[index],
                                strokeStyle: dataset.backgroundColor[index],
                                lineWidth: 1,
                                hidden: chart.getDatasetMeta(0).data[index].hidden,
                                index,
                            };
                        });
                    },
                },
            },
        },
        cutout: "60%",
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Sales by Category
            </h2>
            <div className="relative w-full h-64">
                <Doughnut data={data} options={options} />
            </div>
        </div>
    );
}
