import React, { useState } from "react";
import { SearchBar } from "./SearchBar";
import { CustomersTable } from "./CustomersTable";
import { api } from "~/utils/api";
import { CreateCustomerModal } from "./CreateCustomerModal";

export type CustomerFilters = {
  first_name?: string;
  last_name?: string;
  address?: string;
  phone?: string;
  email?: string;
};

export const CustomersTab: React.FC = ({}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
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
  const removeFilter = (k: keyof CustomerFilters) => {
    const copy = Object.assign({}, filters);
    delete copy[k];
    setFilters(copy);
  };
  return (
    <div className="flex flex-col w-full p-4 bg-white min-w-fit mx-auto max-w-7xl">
      <CreateCustomerModal isOpen={isOpen} closeModal={closeModal} />
      <div className="flex py-4 gap-2">
        <h1 className="text-2xl font-bold dark:text-white">All Customers</h1>
      </div>
      <SearchBar
        addFilter={addFilter}
        removeFilter={removeFilter}
        filters={filters}
      >
        <button
          onClick={openModal}
          className="px-4 bg-highlight text-white shadow-md rounded-lg flex
        items-center justify-center gap-2 h-9"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Create Customer
        </button>
      </SearchBar>
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
