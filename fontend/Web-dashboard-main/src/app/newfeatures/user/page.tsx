"use client";
import React, { useState } from "react";
import UserTable from "./components/UserTable";
import SearchBox from "./components/SearchBox";

export default function UserPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="mt-[170px] flex-none w-full max-w-full px-3">
      <div className="relative flex flex-col bg-white mt-[-9rem] p-4">
        <h1 className="text-2xl font-bold mb-4">User All</h1>

        <div className="flex justify-between">
          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder="Search users..."
          />
        </div>

        <div>
          <UserTable search={search} />
        </div>
      </div>
    </div>
  );
}
