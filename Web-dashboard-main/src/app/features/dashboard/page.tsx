"use client";

import BarChartComponent from "./components/bar";
import PieChartComponent from "./components/PieChartComponent ";
import Top_products from "./components/Top_products";

const DashBoard = () => {
  const calculateChange = (value: string, change: string) => {
    const numberMatch = value.match(/[\d,.]+/); // Extract numbers like "$3.5M" → "3.5"
    const percentageMatch = change.match(/-?\d+(\.\d+)?/); // Extract percentage like "-2%" → "-2"

    if (!numberMatch || !percentageMatch) return "N/A";

    let baseValue = parseFloat(numberMatch[0].replace(",", "")); // Remove commas from number

    // Convert value to "K" if over 1000
    if (baseValue >= 1000 && baseValue < 1000000) {
      baseValue /= 1000;
      value = value.replace(numberMatch[0], baseValue.toFixed(1) + "K");
    }

    if (value.includes("M")) baseValue *= 1_000_000;
    if (value.includes("K")) baseValue *= 1_000;

    const percentage = parseFloat(percentageMatch[0]) / 100;
    const result = baseValue * percentage;

    // Handle negative values
    if (result < 0) {
      return `-${Math.abs(result / 1000).toFixed(0)}K`; // Show negative in "K" (e.g., "-70K")
    }

    // Append 'K' if the result exceeds 1000
    if (result >= 1000 && result < 1000000) {
      return (result / 1000).toFixed(0) + "K"; // Display "10K" instead of "10k"
    }

    return result.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const statsData = [
    {
      title: "Total Sales",
      value: "$120,784.02",
      change: "2% since last quarter",
      icon: "/slie/store.png",
      details: ["Increased client retention", "Positive feedback"],
      trendIcon: "icon/arrow-up.png",
    },
    {
      title: "Visitors",
      value: "18,896",
      change: "-5.6% since last month",
      icon: "/slie/store.png",
      details: ["Improved performance", "Optimistic forecast"],
      trendIcon: "icon/arrow-up.png",
    },
    {
      title: "Total Orders",
      value: "8,500",
      change: "+3% since last quarter",
      icon: "/slie/store.png",
      details: ["Higher engagement", "Better support"],
      trendIcon: "icon/arrow-up.png",
    },
    {
      title: "Refunded",
      value: "$2,876",
      change: "+13% since last month",
      icon: "/slie/store.png",
      details: ["Steady growth", "Increased demand"],
      trendIcon: "icon/arrow-up.png",
    },
  ];

  const topSellingProducts = [
    {
      name: "Product A",
      orderId: "12345",
      price: "$50.00",
      inStock: "Yes",
      unitsSold: "2,000",
    },
    {
      name: "Product B",
      orderId: "12346",
      price: "$30.00",
      inStock: "No",
      unitsSold: "1,500",
    },
    {
      name: "Product C",
      orderId: "12347",
      price: "$75.00",
      inStock: "Yes",
      unitsSold: "3,000",
    },
    {
      name: "Product D",
      orderId: "12348",
      price: "$120.00",
      inStock: "No",
      unitsSold: "500",
    },
  ];

  return (
    <div className="w-full bg-gray-100">
      <div className="h-full">
        <div>
          {/* Card Section */}
          <div className="flex md:flex-row flex-col">
            <div className="w-2/5 md:w-2/5 w-full p-4">
              <div className="flex flex-wrap">
                {statsData.map((stat, index) => (
                  <div key={index} className="w-1/2 p-3">
                    <div className="bg-white shadow-lg rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={stat.icon}
                          alt={stat.title}
                          className="w-4 h-4"
                        />
                        <h2 className="text-lg font-bold">{stat.title}</h2>
                      </div>

                      <div className="mt-1 bottom-1 border-b-[1px] border-gray-300 pb-2">
                        <p
                          className={`text-xl font-semibold ${
                            stat.change.includes("-")
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {stat.value}
                        </p>
                        <p className="text-sm font-medium text-gray-400 ">
                          <span>{stat.change.split(" ")[0]}</span>
                          <span className="ml-1">
                            {stat.change.split(" ").slice(1).join(" ")}
                          </span>
                        </p>
                      </div>

                      <div className="mt-2 flex items-center">
                        <p className="text-sm">View Report</p>
                        <div className="mt-1 flex items-center justify-center h-full">
                          <img
                            src="/up-arrowRigth.png"
                            alt=""
                            className="w-2 h-2 ml-3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-3/5 p-4">
              <BarChartComponent />
            </div>
          </div>
          {/* Chart Section */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="w-full md:flex-[70%] bg-gray-100 rounded-lg p-4 shadow-md">
              <Top_products />
            </div>
            <div className="w-full md:flex-[20%] bg-gray-100 flex items-center justify-center rounded-lg p-4 shadow-md">
              <PieChartComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
