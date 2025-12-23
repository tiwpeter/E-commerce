"use client";
import React from "react";

interface Step {
  id: number;
  title: string;
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
}

interface StepNavigationProps {
  currentStep: number; // Step ปัจจุบัน (1-based)
}

const steps: Step[] = [
  {
    id: 1,
    title: "Cart",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M3 3h2l.4 2M7 13h14l-1.35 6.45a1 1 0 01-1 .55H8a1 1 0 01-1-1v-5a4 4 0 00-4-4H3"></path>
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
      </svg>
    ),
  },
  {
    id: 2,
    title: "Checkout",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M16 8v6a4 4 0 11-8 0V8"></path>
        <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
      </svg>
    ),
  },
  {
    id: 3,
    title: "Order",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M9 17v-6a4 4 0 118 0v6"></path>
        <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
      </svg>
    ),
  },
];

const StepNavigation: React.FC<StepNavigationProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-center mb-8 space-x-10 bg-gray-100 p-4 rounded-lg">
      {steps.map((step) => {
        const isActive = step.id === currentStep;
        return (
          <div key={step.id} className="flex items-center space-x-2">
            {/* Circle + Icon */}
            <div
              className={`p-2 rounded-full ${
                isActive ? "bg-black" : "bg-gray-300"
              }`}
            >
              {React.cloneElement(step.icon, {
                className: `w-5 h-5 ${
                  isActive ? "text-white" : "text-gray-500"
                }`,
              })}
            </div>
            {/* Title */}
            <span
              className={`${
                isActive ? "text-black" : "text-gray-400"
              } font-semibold`}
            >
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default StepNavigation;
