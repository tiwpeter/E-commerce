"use client";
import React from "react";
import UserTable from "./components/UserTable";
import AddUserForm from "./components/AddUserForm";

export default function UserPage() {
  return (
    <div className="mt-[170px] flex-none w-full max-w-full px-3">
      <div className="relative flex flex-col bg-white mt-[-9rem] p-4">
        <div className="flex">
          <h1 className="text-2xl font-bold mb-4">User All</h1>
          <div>
            <AddUserForm />
          </div>
        </div>
        <UserTable />
      </div>
    </div>
  );
}
