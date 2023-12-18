import React, { useState } from "react";
import { SearchBar } from "./SearchBar";
import { CustomersTable } from "./CustomersTable";
import { api } from "~/utils/api";

type CustomerFilters = {
  first_name?: string;
  last_name?: string;
  address?: string;
  phone?: string;
  email?: string;
  page: number;
  page_size: number;
};

export const CustomersTab: React.FC = ({}) => {
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<CustomerFilters>();
  const { data } = api.customer.getAll.useQuery(
    {
      ...filters,
      page,
      page_size: 15,
    },
    {
      keepPreviousData: true,
    }
  );

  const addFilter = (k: keyof CustomerFilters, v: string) => {
    setPage(1);
    setFilters({ ...filters, [k]: v });
  };
  const removeFilter = (k: string) => {
    const copy = Object.assign({}, filters);
    delete copy[k];
    setFilters(copy);
  };
  return (
    <div className="flex flex-col w-full p-4 bg-white min-w-fit mx-auto max-w-7xl">
      <h1 className="text-2xl font-bold py-4 dark:text-white">All Customers</h1>
      <SearchBar
        addFilter={addFilter}
        removeFilter={removeFilter}
        filters={filters}
      />
      <CustomersTable
        customers={data?.data}
        page={page}
        total_pages={data?.meta.total_pages ?? 0}
        nextPage={() => {
          if (page === data?.meta.total_pages) {
            return;
          }
          setPage(page + 1);
        }}
        prevPage={() => {
          if (page === 1) {
            return;
          }
          setPage(page - 1);
        }}
      />
    </div>
  );
};
