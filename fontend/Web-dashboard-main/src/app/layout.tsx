"use client";

import { ReactNode, useState } from "react";
import { Inter } from "next/font/google";
import Slieder from "@/app/component/Sidebar";
import Navpage from "@/app/component/navpage";
import "./globals.css";
//import SliederEX from "./component/layout/Slie/Test";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {/* Desktop Layout */}
        <div className="hidden md:flex flex-row h-auto">
          <div className="relative shrink-0 bg-white z-[1]">
            <Slieder />
          </div>

          <main className="absolute bg-black min-h-[17.75rem] w-full">
            <nav
              style={{ marginLeft: "17.5rem" }}
              className="flex items-center justify-between p-4 ml-[17.5rem] sm:ml-0"
            >
              <div className="flex-col text-xl font-bold text-white mx-3">
                <Navpage />
              </div>

              <div className="ml-4 flex space-x-4 items-center">
                <img
                  src="/nav/loupe.png"
                  alt="Image 1"
                  className="w-[1.2rem] h-[1.2rem] filter grayscale invert"
                />
                <img
                  src="/nav/user.png"
                  alt="Image 1"
                  className="w-[1.2rem] h-[1.2rem] filter grayscale invert"
                />
                <span className="text-white text-[1.2rem]">Sign in</span>
                <img
                  src="/nav/setting.png"
                  alt="Image 1"
                  className="w-[1.2rem] h-[1.2rem] filter grayscale invert"
                />
                <img
                  src="/nav/bellD.png"
                  alt="Image 1"
                  className="w-[1.2rem] h-[1.2rem] filter grayscale invert"
                />
              </div>
            </nav>
          </main>

          <div
            className="relative w-full h-auto mt-[6rem] bg-white mx-3"
            style={{ marginLeft: "19rem" }}
          >
            {children}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex flex-col md:hidden">
          <nav className="flex justify-between items-center p-4 bg-black text-white">
            <div className="text-xl font-bold ">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                data-slot="sidebar-trigger"
                className=""
                data-sidebar="trigger"
                {...({
                  fdprocessedid: "b7rov4",
                } as React.HTMLAttributes<HTMLButtonElement>)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-panel-left !w-6 !h-8 text-[#6f7d9a]"
                  aria-hidden="true"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                  <path d="M9 3v18"></path>
                </svg>

                <span className="sr-only">Toggle Sidebar</span>
              </button>
            </div>
            <div className="flex space-x-4 items-center">
              <img src="/nav/loupe.png" className="w-6 h-6 invert" />
              <img src="/nav/user.png" className="w-6 h-6 invert" />
            </div>
          </nav>
          <div className="relative shrink-0 bg-white z-[1]">
            <Slieder
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />
          </div>
          <main className="w-full p-4 bg-white">{children}</main>

          {/* Optional bottom menu 
          <div className="fixed bottom-0 w-full flex justify-around p-2 bg-gray-100 border-t md:hidden">
            <img src="/nav/home.png" className="w-6 h-6" />
            <img src="/nav/search.png" className="w-6 h-6" />
            <img src="/nav/bellD.png" className="w-6 h-6" />
            <img src="/nav/user.png" className="w-6 h-6" />
          </div>
          */}
        </div>
      </body>
    </html>
  );
}
