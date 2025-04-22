"use client";

import { getTotalOrganizations, getTotalScreenshots, getTotalUsers, totalClockInsToday, totalNewOrganizationsThisMonth, totalNewUsersThisMonth } from "@/app/api/dashboard-service";
import { useEffect, useState } from "react";
import { FaCamera, FaClock, FaRegUser, FaUserPlus } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa";

export default function SuperAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({
    users: 0,
    organizations: 0,
    screenshots: 0,
    clockIns: 0,
    usersThisMonth: 0,  
    organizationsThisMonth: 0,
  });

  const metrics = [
    {
      label: "Total Users",
      value: totals.users,
      icon: <FaRegUser className="w-6 h-6 text-blue-500" />,
    },
    {
      label: "Total Organizations",
      value: totals.organizations,
      icon: <FaBuilding className="w-6 h-6 text-green-500" />,
    },
    {
      label: "Total Screenshots",
      value: totals.screenshots,
      icon: <FaCamera className="w-6 h-6 text-purple-500" />,
    },
    {
      label: "Total Clock Ins Today",
      value: totals.clockIns,
      icon: <FaClock className="w-6 h-6 text-yellow-500" />,
    },
    {
      label: "New Users This Month",
      value: totals.usersThisMonth,
      icon: <FaUserPlus className="w-6 h-6 text-pink-500" />,
    },
    {
      label: "New Organizations This Month",
      value: totals.organizationsThisMonth,
      icon: <FaBuilding className="w-6 h-6 text-red-500" />,
    },
  ];
  

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const usersRes = await getTotalUsers();
        const orgsRes = await getTotalOrganizations();
        const shotsRes = await getTotalScreenshots();
        const clockInsRes = await totalClockInsToday();
        const usersThisMonthRes = await totalNewUsersThisMonth();
        const orgsThisMonthRes = await totalNewOrganizationsThisMonth();
        setTotals({
            users: usersRes,
            organizations: orgsRes,
            screenshots: shotsRes,
            clockIns: clockInsRes,
            usersThisMonth: usersThisMonthRes,
            organizationsThisMonth: orgsThisMonthRes,
          });
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold mb-4">Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {metrics.map((item, idx) => (
            <div
                key={idx}
                className="flex items-center gap-4 shadow-md rounded-2xl p-5 border border-gray-100"
            >
                <div className="p-3 rounded-full bg-gray-100">{item.icon}</div>
                <div>
                <h3 className="text-sm ">{item.label}</h3>
                <p className="text-2xl font-semibold ">{item.value}</p>
                </div>
            </div>
            ))}
        </div>
    </div>

  );
}
