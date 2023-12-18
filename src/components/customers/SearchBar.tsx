import React, { useState } from "react";
import SearchOptions from "./SearchOptions";
import { CustomerFilters } from "./CustomersTab";

interface SearchBarProps {
  filters?: CustomerFilters;
  removeFilter: (k: keyof CustomerFilters) => void;
  addFilter: (k: keyof CustomerFilters, v: string) => void;
}

interface FilterOption {
  name: string;
  key: keyof CustomerFilters;
}

const filterOptions: FilterOption[] = [
  { name: "First name", key: "first_name" },
  { name: "Last name", key: "last_name" },
  { name: "Address", key: "address" },
  { name: "Phone", key: "phone" },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  filters,
  addFilter,
  removeFilter,
}) => {
  const [filter, setFilter] = useState<FilterOption>(filterOptions[0]!);
  const [filterText, setFilterText] = useState<string>("");
  const renderChips = () => {
    const chips: React.ReactNode[] = [];

    for (const key in filters) {
      const k = key as keyof CustomerFilters;
      chips.push(
        <div className="bg-secondary text-white px-3 py-1 w-fit rounded-xl text-sm flex items-center shadow-lg gap-2">
          <p>
            <span className="font-bold">
              {filterOptions.find((opt) => opt.key === key)?.name}
            </span>
            : {filters[k]}
          </p>
          <button
            onClick={() => {
              removeFilter(k);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="black"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      );
    }
    return chips;
  };

  return (
    <div className="flex flex-col">
      <div className=" bg-secondary rounded flex p-2 gap-2 items-center shadow-md">
        <input
          value={filterText}
          onChange={(e) => {
            setFilterText(e.target.value);
          }}
          className=" bg-white py-2 pl-3 rounded-lg shadow-md placeholder-black h-9"
          placeholder="Search"
        />
        <SearchOptions
          filters={filterOptions}
          selectedFilter={filter ?? { name: filterOptions[0]?.name }}
          setSelectedFilter={setFilter}
        />
        <button
          className="px-4 bg-mrts-orange text-white shadow-md rounded-lg flex items-center justify-center gap-2 h-9"
          onClick={() => {
            addFilter(filter.key, filterText);
          }}
          disabled={filterText == ""}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          Search
        </button>
      </div>
      <div className="flex gap-2 p-2">{renderChips()}</div>
    </div>
  );
};
