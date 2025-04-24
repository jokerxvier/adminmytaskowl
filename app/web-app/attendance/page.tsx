'use client';

import { searchOrg } from '@/app/api/organization-service';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { useState } from 'react';
import { Calendar } from '@heroui/calendar'; // Ensure HeroUI Calendar is imported

export default function AttendancePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<any | null>(null); // Ensure it starts as null
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState({ users: 1, teams: 1, tasks: 1, projects: 1 });

  // Function to search organizations based on query
  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchOrg(query); // Fetching data from the search API
      const foundOrg = data.response[0]; // Assuming 'response' is an array
      setResults([foundOrg]); // Set the first found organization
      setSelectedOrg(foundOrg); // Set selected organization
      setPage({ users: 1, teams: 1, tasks: 1, projects: 1 }); // Set default page state
    } catch (err: any) {
      setError(err.message || "An error occurred while searching for organizations.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the input change
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value); // Update query on input change
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <Input
        label="Search Organization"
        placeholder="Start typing..."
        value={query}
        onChange={handleInputChange} // Update query without triggering search here
      />
      <Button onClick={handleSearch} disabled={query.length < 2 || loading}>
        {loading ? 'Searching...' : 'Search'}
      </Button>

      {/* Display error message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display search results */}
      {results.length > 0 && (
        <ul className="border rounded-md shadow mt-4">
          {results.map((org) => (
            <li
              key={org.organization_id}
              className="px-4 py-2 cursor-pointer"
              onClick={() => setOpen(true)} // Open modal with org details
            >
              <strong>ID:</strong> {org.organization_id}, <strong>Name:</strong> {org.name}
            </li>
          ))}
        </ul>
      )}

      {/* Modal for displaying organization details and HeroUI Calendar */}
      {open && selectedOrg && ( 
        <div className="inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setOpen(false)} // Close modal
            >
              ✕
            </button>
            {/* HeroUI Calendar */}
            <div className="mt-4 items-center justify-center">
              <Calendar />  {/* Ensure HeroUI Calendar renders correctly */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
