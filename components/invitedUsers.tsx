"use client";
import { getInvitedUsers } from "@/app/api/beta-service"; // <-- use this one
import React, { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { format } from "date-fns";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableColumn,
  TableCell,
} from "@heroui/table"; 

type InvitedUser = {
  id: string;
  email: string;
  user_limit: number;
  used: number;
  created_at: string;
  status: string;
};

const InvitedUsers: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<InvitedUser[]>([]);
  
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await getInvitedUsers(); // <-- use imported API
        console.log("Fetched invited users:", data);
        if (data && data.response) {
          setUsers(data.response);
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching users.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Invited Users Table</h2>
      <p className="text-gray-600">View all invited users for beta in the database.</p>
      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && users.length === 0 && (
        <p>No Invited Users Found.</p>
      )}

      {!loading && !error && users.length > 0 && (
        <Table>
          <TableHeader>
            <TableColumn>Email</TableColumn>
            <TableColumn>User Limit</TableColumn>
            <TableColumn>Accepted</TableColumn>
            <TableColumn>Invited On</TableColumn>
            <TableColumn>Status</TableColumn>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.user_limit}</TableCell>
                <TableCell>{user.used === 1 ? "YES" : "NO"}</TableCell>
                <TableCell>
                  {format(new Date(user.created_at), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>{user.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default InvitedUsers;
