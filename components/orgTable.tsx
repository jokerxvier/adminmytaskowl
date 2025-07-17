'use client';

import { useEffect, useState } from "react";
import { getOrganizations } from "@/app/api/organization-service";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableColumn,
} from "@heroui/table"; // adjust if needed

export default function OrganizationTable() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<any[]>([]);

  const fetchOrganizations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrganizations();
      if (data && data.response) {
        setOrganizations(data.response);
      } else {
        setError("No data received.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching organizations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Organizations Table</h2>
        <p className="text-gray-600">
          View all organizations in the database.
        </p>
      {loading && <p>Loading organizations...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && organizations.length === 0 && (
        <p>No organizations found.</p>
      )}

      {!loading && !error && organizations.length > 0 && (
        <Table>
          <TableHeader>
            <TableColumn>Organization ID</TableColumn>
            <TableColumn>Name</TableColumn>
            <TableColumn>User Limit</TableColumn>
            <TableColumn>User Count</TableColumn>
            <TableColumn>Owner</TableColumn>
            <TableColumn>Created At</TableColumn>
            <TableColumn>Invitation Code</TableColumn>
          </TableHeader>
          <TableBody>
            {organizations.map((org) => (
              <TableRow key={org.organization_id}>
                <TableCell>{org.organization_id}</TableCell>
                <TableCell>{org.name}</TableCell>
                <TableCell>{org.user_limit}</TableCell>
                <TableCell>{org.user_count}</TableCell>
                <TableCell>{org.owner_name}</TableCell>
                <TableCell>
                  {new Date(org.created_at).toLocaleString("en-PH", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell>{org.invitation_code}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
