'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BiSearch } from 'react-icons/bi';

export default function Search() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;
    router.push(`/?search=${searchTerm}`);
  };

  return (
    <div className="border w-full py-2 rounded-full shadow-sm hover:shadow-md transition">
      <div className="flex flex-row items-center justify-between">
        <input
          type="text"
          placeholder="Search by title or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="
            w-full
            pl-6
            pr-2
            text-sm
            font-semibold
            placeholder-gray-600
            focus:outline-none
            bg-transparent
          "
        />
        <button 
          onClick={handleSearch}
          className="p-2 bg-rose-500 rounded-full text-white mr-2"
        >
          <BiSearch size={18} />
        </button>
      </div>
    </div>
  );
}