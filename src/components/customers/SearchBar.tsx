import React from "react";
import SearchOptions from "./SearchOptions";

interface SearchBarProps {
  filters: [];
}

export const SearchBar: React.FC<SearchBarProps> = ({}) => {
  return (
    <div className="w-full bg-secondary rounded flex p-2 gap-2 items-center shadow-md">
      <input
        className=" bg-white py-2 pl-3 rounded-lg shadow-md placeholder-black h-9"
        placeholder="Search"
      />
      <SearchOptions />
      <button className="px-4 bg-mrts-orange text-white shadow-md rounded-lg flex items-center justify-center gap-2 h-9">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        Search
      </button>
    </div>
  );
};
