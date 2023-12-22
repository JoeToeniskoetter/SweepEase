import React from "react";
import type { CustomerWithAddress } from "~/server/db/schema";
import CustomerOptionsButton from "./CustomerOptionsButton";
import { useCustomerStore } from "~/stores/customerStore";

const columns = ["Name", "Address", "City", "State", "Zip", "Phone", "Options"];

interface CustomersTableProps {
  customers?: CustomerWithAddress[];
  page: number;
  total_pages: number;
  nextPage: () => void;
  prevPage: () => void;
}

export const CustomersTable: React.FC<CustomersTableProps> = ({
  customers,
  page,
  total_pages,
  nextPage,
  prevPage,
}) => {
  const { setCustomer } = useCustomerStore();
  const renderPages = () => {
    const pages = [];
    const maxPagesToShow = 10;

    for (let i = 1; i <= total_pages; i++) {
      if (
        i <= maxPagesToShow ||
        (page >= total_pages - maxPagesToShow &&
          i > total_pages - maxPagesToShow)
      ) {
        pages.push(
          <button
            key={i}
            aria-current="page"
            className={`relative z-10 inline-flex items-center ${
              page === i ? "bg-mrts-orange" : "bg-gray-400"
            } px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
          >
            {i}
          </button>
        );
      }
    }

    if (total_pages > maxPagesToShow) {
      if (page <= total_pages - maxPagesToShow) {
        pages.splice(
          maxPagesToShow,
          page,
          <span
            key="ellipsis"
            className={`relative z-10 inline-flex items-center bg-blue-200"
            px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
          >
            ...
          </span>
        );
      } else {
        pages.splice(
          0,
          0,
          <div
            key="ellipsis"
            className={`relative z-10 inline-flex items-center bg-red-200"
            px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
          >
            ...
          </div>
        );
      }
    }

    return pages;
  };

  return (
    <div className="shadow-md sm:rounded-lg">
      <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {columns.map((column) => {
              return (
                <th key={column} scope="col" className="px-6 py-3">
                  {column}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {customers?.map((customer) => {
            return (
              <tr
                key={customer.id}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {customer.first_name} {customer.last_name}
                </th>
                <td className="px-6 py-4">{customer.address?.address1}</td>
                <td className="px-6 py-4">{customer.address?.city}</td>
                <td className="px-6 py-4">{customer.address?.state}</td>
                <td className="px-6 py-4">{customer.address?.zip}</td>
                <td className="px-6 py-4">{customer.phone}</td>
                <td className="px-6 py-4">
                  <CustomerOptionsButton onEdit={() => setCustomer(customer)} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={prevPage}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={nextPage}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div></div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={prevPage}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {renderPages()}
              <button
                onClick={nextPage}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Next</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};
