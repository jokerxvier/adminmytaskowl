'use client';

import { searchOrg } from '@/app/api/organization-service';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { useState } from 'react';
import { Calendar, DateValue } from '@heroui/calendar'; // Ensure HeroUI Calendar is imported
import { Divider } from '@heroui/divider';
import { getAttendance } from '@/app/api/attendance-service';
import {parseDate, getLocalTimeZone, today} from "@internationalized/date";
import { Chip } from '@heroui/chip';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table';

export default function AttendancePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<any | null>(null); // Ensure it starts as null
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState({ users: 1, teams: 1, tasks: 1, projects: 1 });
  const [selectedDate, setSelectedDate] = useState<any | null>();
  const [attendance, setAttendance] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to search organizations based on query
  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchOrg(query);
      const foundOrgs = data.response; // This is already an array
      
      // CORRECT: Set the array directly without wrapping it
      setResults(foundOrgs); 
      
      // Set first org as selected (optional)
      if (foundOrgs.length > 0) {
        setSelectedOrg(foundOrgs[0]);
      }
      
      setPage({ users: 1, teams: 1, tasks: 1, projects: 1 });
      console.log('Search results:', foundOrgs);
    } catch (err: any) {
      setError(err.message || "An error occurred while searching for organizations.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetAttendance = async (date: any) => {
    if (!date) return;
    let orgID = selectedOrg.organization_id
    try {
      setIsLoading(true);
      setError(null);
      
      // Format the date for API call
      const formattedDate = date.toDate(getLocalTimeZone()).toISOString().split('T')[0];
      const attendanceData = await getAttendance(formattedDate, orgID);
      setAttendance(attendanceData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch attendance');
      console.error('Error fetching attendance:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Combined handler for date change
  const handleDateChange = (date: any) => {
    setSelectedDate(date);
    handleGetAttendance(date);
  };

  // Function to handle the input change
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value); // Update query on input change
  }

  return (
    <div className=" p-4 space-y-4">
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
        <ul className="">
          {results.map((org) => (
            <li
              key={org.organization_id}
              className="px-4 py-2 cursor-pointer border rounded-md shadow mt-4"
              onClick={() => {
                setOpen(true);
                setSelectedOrg(org);
              }}
            >
              <strong>ID:</strong> {org.organization_id}, <strong>Name:</strong> {org.name}
            </li>
          ))}
        </ul>
      )}

      {/* Modal for displaying organization details and HeroUI Calendar */}
      {open && selectedOrg && (  
        <div className="inset-0 z-50  flex items-center justify-center ">
          <div className="rounded-lg shadow-lg p-6 w-full max-w-md relative flex flex-col items-center justify-center border rounded-md">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setOpen(false)} // Close modal
            >
              ✕
            </button>
            {/* HeroUI Calendar */}
            <div className='mt-4 items-center justify-center '>
              <span className='text-md '>
                  {selectedOrg.name}
              </span> 
              <Divider className="my-4"/>
            </div>
            <div className="mt-4 items-center justify-center ">
              <Calendar 
                aria-label="Date (Controlled)" 
                value={selectedDate} 
                onChange={handleDateChange}  // Use the combined handler
                isDateUnavailable={(date) => {
                  const jsDate = date.toDate(getLocalTimeZone());
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return jsDate > today;
                }}
              />
            </div>
          </div>
        </div>
      )}
        {/* Display loading state or attendance data */}
        {isLoading && <p>Loading attendance data...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {attendance.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg text-center font-medium my-8">Attendance for {selectedDate?.toString()}</h3>
            <Table aria-label="Attendance table">
              <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>Name</TableColumn>
                <TableColumn>Time In</TableColumn>
                <TableColumn>Time Out</TableColumn>
                <TableColumn>Status</TableColumn>
              </TableHeader>
              <TableBody>
                {attendance.map((record) => (
                  <TableRow key={record.id || record.user_id}>
                    <TableCell>{record.user_id}</TableCell>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>
                      {record.started_at ? new Date(record.started_at).toLocaleTimeString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {record.ended_at ? new Date(record.ended_at).toLocaleTimeString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        color={
                          record.status === 'On Time' ? 'success' :
                          record.status === 'Late' ? 'warning' :
                          record.status === 'Absent' ? 'danger' : 'default'
                        }
                        variant="flat"
                        classNames={{
                          base: "capitalize", // Makes status text capitalized
                          content: "font-medium" // Makes text slightly bold
                        }}
                      >
                        {record.status || 'No Schedule'}
                      </Chip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
    </div>
  );
}
