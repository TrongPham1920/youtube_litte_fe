import React, { useState } from 'react';
import { Search, Mic } from 'lucide-react';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality here
    console.log(`Searching for: ${query}`);
  };

  return (
    <div className="flex w-full items-center">
      <form onSubmit={handleSubmit} className="flex flex-1">
        <div className="relative flex flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-l-full focus:outline-none focus:border-blue-500 dark:bg-zinc-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <button 
            type="submit"
            className="px-5 py-2 bg-gray-100 dark:bg-zinc-700 border border-l-0 border-gray-300 dark:border-zinc-700 rounded-r-full hover:bg-gray-200 dark:hover:bg-zinc-600 focus:outline-none"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </form>
      <button 
        className="ml-2 p-2 rounded-full bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600"
        aria-label="Search with voice"
      >
        <Mic className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>
    </div>
  );
};

export default SearchBar;