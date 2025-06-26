"use client";
import { useState, useEffect } from "react";

import { countDuplicates as fetchDuplicateCounts, cleanupDuplicates, deleteDuplicatesFromDB } from "@/app/api/cleanup-service";
import {  } from "@/app/api/cleanup-service";
import { Spinner } from "@heroui/spinner";
import { MdCleaningServices } from "react-icons/md";
import { addToast } from "@heroui/toast";
import { PasswordVerifyModal } from "@/components/verifyPassword";
import { FaTrash } from "react-icons/fa";

export default function cleanupPage(){
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userTaskCount, setUserTaskCount] = useState<number |null>(null);
  const [userProjectCount, setUserProjectCount] = useState<number |null>(null);
  const [userTeamCount, setUserTeamCount] = useState<number |null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  
  const [pendingAction, setPendingAction] = useState<{
    action: () => Promise<void>;
    description: string;
  } | null>(null);  

  const requirePasswordVerification = (
    action: () => Promise<void>,
    description: string,
  ) => {
    setPendingAction({ action, description });
    setIsVerifyModalOpen(true);
  };

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

    const cleanupDuplicate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cleanupDuplicates();

      if(data.status === 'success'){
            setLoading(false);
            loadDuplicates();
            addToast({
              title: "Duplicates Cleaned Up",
              timeout: 3000,
              shouldShowTimeoutProgress: true,
              color: "success",
            });
      }else{
        setError(
        "An error occurred while cleaning up duplicates.",
      );
      }
    } catch (err: any) {
      setError(
        err.message || "An error occurred while fetching duplicates.",
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteDuplicates = () => {
    requirePasswordVerification(async () => {
      setLoading(true);
      setError(null);
          try {
          const data = await deleteDuplicatesFromDB();

          if(data.status === 'success'){
                setLoading(false);
                loadDuplicates();
                addToast({
                  title: "Duplicates Deleted in Database",
                  timeout: 3000,
                  shouldShowTimeoutProgress: true,
                  color: "success",
                });
          }else{
            setError(
            "An error occurred while cleaning up duplicates.",
          );
          }
        } catch (err: any) {
          setError(
            err.message || "An error occurred while fetching duplicates.",
          );
        } finally {
          setLoading(false);
        }
    }, "Delete Duplicates on Database? Deleting data from database can't be reversed!");
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
    <div className=" p-12 bg-indigo-500 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ">
      <h1 className="text-2xl text-center font-bold mb-6 text-white">Duplicates</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${table.className} w-full`}
            role="button"
            tabIndex={0}
          >
            <h3 className="text-gray-700 text-xl font-semibold mb-2 text-center">
              {table.table_name}: {table.count ?? "..."}
            </h3>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">

        <div
          className="mt-4 mx-auto p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 w-full bg-success "
          role="button"
          tabIndex={0}
          onClick={() => cleanupDuplicate()}
        >
          <span className="flex justify-center items-center gap-2 text-white text-lg font-medium">
            Cleanup Duplicates
            <MdCleaningServices />
          </span>
        </div>
        <div
          className="mt-4 mx-auto p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300  w-full bg-danger "
          role="button"
          tabIndex={0}
          onClick={() => deleteDuplicates()}
        >
          <span className="flex justify-center items-center gap-2 text-white text-lg font-medium">
            Delete Duplicates from DB
            <FaTrash />
          </span>
        </div>
      </div>
    </div>
    <PasswordVerifyModal
            description={pendingAction?.description || ""}
            isOpen={isVerifyModalOpen}
            title="Confirm Action"
            onOpenChange={setIsVerifyModalOpen}
            onVerified={() => {
              if (pendingAction) {
                pendingAction.action();
              }
            }}
          />
  </div>
  
);


    
    
}