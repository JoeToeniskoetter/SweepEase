import React from "react";
import { SearchBar } from "./SearchBar";
import { CustomersTable } from "./CustomersTable";

export const CustomersTab: React.FC = ({}) => {
  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl font-bold py-4 dark:text-white">All Customers</h1>
      <SearchBar filters={[]} />
      <CustomersTable />
    </div>
  );
};
