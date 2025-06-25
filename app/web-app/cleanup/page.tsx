"use client";
import { useState, useEffect } from "react";

import { countDuplicates as fetchDuplicateCounts } from "@/app/api/cleanup-service";
import {CircularProgress} from "@heroui/progress";
import { Spinner } from "@heroui/spinner";
import { MdCleaningServices } from "react-icons/md";

export default function cleanupPage(){
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userTaskCount, setUserTaskCount] = useState<number |null>(null);
  const [userProjectCount, setUserProjectCount] = useState<number |null>(null);
  const [userTeamCount, setUserTeamCount] = useState<number |null>(null);
    
  // ✅ Unique name
  const loadDuplicates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDuplicateCounts();

      setUserProjectCount(data.user_has_project);
      setUserTaskCount(data.user_has_task);
      setUserTeamCount(data.user_has_team);
    } catch (err: any) {
      setError(
        err.message || "An error occurred while fetching duplicates.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDuplicates();
  }, []);


    const tables = [
        {
            table_name: 'user_has_project',
            count: userProjectCount,
            className: "bg-gradient-to-br from-pink-50 to-pink-100 cursor-pointer",
        },
        {
            table_name: 'user_has_team',
            count: userTeamCount,
            className: "bg-gradient-to-br from-pink-50 to-pink-100 cursor-pointer",
        },
        {
            table_name: 'user_has_task',
            count: userTaskCount,
            className: "bg-gradient-to-br from-pink-50 to-pink-100 cursor-pointer",
        },
    ]
return (
  <div className="relative min-h-screen">
    {loading && (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
        <Spinner
          label={`Loading `}
          variant="simple"
        />
      </div>
    )}
    <div className="px-4 pt-24">
      <h1 className="text-2xl text-center font-bold mb-6">Duplicates</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${table.className} w-full`}
            role="button"
            tabIndex={0}
          >
            <h3 className="text-gray-700 text-xl font-semibold mb-2">
              {table.table_name}: {table.count ?? "..."}
            </h3>
          </div>
        ))}
      </div>
      <div
        className="mt-4 mx-auto p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 w-1/2 bg-success "
        role="button"
        tabIndex={0}
      >
        <span className="flex justify-center items-center gap-2 text-white text-lg font-medium">
          Cleanup Duplicates
          <MdCleaningServices />
        </span>
      </div>
    </div>
  </div>
);


    
    
}