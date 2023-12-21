import React, { useState } from "react";
import { api } from "~/utils/api";
import { CreateServiceModal } from "./NewServiceModal";
import { useServiceStore } from "~/stores/serviceStore";
import ServiceOptionsButtons from "./ServicesOptionButton";
import { useQueryClient } from "@tanstack/react-query";

const columns = ["Service Name", "Type", "Description", "Price", "Options"];

export const ServicesTab: React.FC = ({}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { setService, service } = useServiceStore();
  const { data } = api.service.getAll.useQuery();
  return (
    <div className="w-full flex flex-col bg-white p-4 h-full">
      <CreateServiceModal
        isOpen={isOpen || service !== null}
        closeModal={async () => {
          await queryClient.invalidateQueries([["service", "getAll"]]);
          setIsOpen(false);
          setService(null);
        }}
      />
      <div className="mx-auto max-w-5xl w-full">
        <div className="flex gap-4 items-center justify-between">
          <p className="text-2xl font-bold py-2 font-poppins">Services</p>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-highlight text-white p-2 rounded-2xl shadow text-xs h-full"
          >
            + Create Service
          </button>
        </div>
        <table className="w-full shadow-lg text-sm text-left rtl:text-right text-white-500 dark:text-gray-400">
          <thead className="text-sm text-white uppercase bg-secondary dark:bg-gray-700 dark:text-gray-400">
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
            {data?.map((data) => {
              return (
                <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 h-20 text-md">
                  <td className="px-4 py-3">{data.name}</td>
                  <td className="px-4 py-3">{data.type}</td>
                  <td className="px-4 py-3 max-w-sm">{data.description}</td>
                  <td className="px-4 py-3">
                    <span className="bg-green-400 p-2 rounded-xl text-white top-3ext-center">
                      ${data.price}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <ServiceOptionsButtons onEdit={() => setService(data)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
