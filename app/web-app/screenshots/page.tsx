"use client";
import { getScreenshots, searchScreenshotOrg, selectOrgSS } from "@/app/api/screenshot-service";
import { Button } from "@heroui/button";
import { Calendar } from "@heroui/calendar";
import { Card } from "@heroui/card";
import { Input } from "@heroui/input";
import { useState } from "react";

export default function ScreenshotPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [selectedOrgUsers, setSelectedOrgUsers] = useState<any[]>([]);
  const [selectedOrgID, setSelectedOrgID] = useState<any>(null);
  const [selectedUserID, setSelectedUserID] = useState<any>(null);
  const [userScreenshots, setUserScreenshots] = useState<any[]>([]);
  const [date, setDate] = useState<any>(null);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    setSelectedOrgID(null);
    setSelectedOrgUsers([]);
    try {
      const data = await searchScreenshotOrg(query);
      setOrganizations(data.response || []);
    } catch (err: any) {
      setError(err.message || "An error occurred while searching for organizations.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrg = async (orgId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await selectOrgSS(orgId); 
      setSelectedOrgUsers(data.response|| []);
      setSelectedOrgID(orgId);
    } catch (err: any) {
      setError(err.message || "Failed to load organization details.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetScreenshots = async (userID: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getScreenshots(selectedOrgID, userID, date); 
      setUserScreenshots(data.response|| []);
      selectedUserID(userID);
    } catch (err: any) {
      setError(err.message || "Failed to load organization details.");
    } finally {
      setLoading(false);
    }
  };

    function parseDate(arg0: string): unknown {
        throw new Error("Function not implemented.");
    }

  return (
    <div className="flex flex-col w-full h-full">
      <h1 className="text-2xl font-bold">Screenshots</h1>
      <div className="flex flex-row gap-4 items-center mb-4">
        <Input
          placeholder="Search organization..."
          label="Organization"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!selectedOrgID &&
      <div className="space-y-4 grid">
        {organizations.map((org) => (
          <div key={org.organization_id} className="row">
            <div className="flex items-center gap-3 mb-4">
              <Button className="text-lg font-semibold" 
              onClick={() => handleSelectOrg(org.organization_id)}
              >{org.name}</Button>
            </div>
          </div>
        ))}
      </div>
    }
      <div className="space-y-4">
        {selectedOrgUsers?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedOrgUsers.map((user) => (
                <div key={`${user.email}-${user.name}`} className="w-full"> 
                <Card className="p-4 h-full flex flex-row">
                    <div className="flex flex-col gap-2">
                        <p className="font-medium truncate">{user.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        <p className="text-sm text-gray-500">{user.role}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center ml-4">
                        <p className="text-[12px] text-center mb-4">Total Screenshots</p>
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 border border-blue-300">
                            <p className="text-sm font-medium text-blue-600">{user.ss_total}</p>
                        </div>
                    </div>
                </Card>
                </div>
            ))}
            </div>
        ) : (
            <p className="text-gray-500">No users found</p>
        )}
        </div>
        <div className="space-y-4">

        {selectedUserID && (
        <Calendar aria-label="Date (Uncontrolled)" />
        )}

        </div>
    </div>
  );
}