import React from "react";
import { api } from "~/utils/api";

const columns = ["Name", "Address", "City", "State", "Zip", "Phone", "Options"];

export const CustomersTable: React.FC = ({}) => {
  const { data } = api.customer.getAll.useQuery({});
  return (
    <div className="shadow-md sm:rounded-lg w-full">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
          <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
            {data?.map((customer) => {
              return (
                <>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {customer.first_name} {customer.last_name}
                  </th>
                  <td className="px-6 py-4">{customer.address}</td>
                  <td className="px-6 py-4">{customer.city}</td>
                  <td className="px-6 py-4">{customer.state}</td>
                  <td className="px-6 py-4">{customer.zip}</td>
                  <td className="px-6 py-4">{customer.phone}</td>
                  <td className="px-6 py-4">
                    <button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  </td>
                </>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
