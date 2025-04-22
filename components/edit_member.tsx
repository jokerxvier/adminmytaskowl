'use client';
import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { searchUser } from "@/app/api/user-service";
import { format } from "date-fns";
import { Table, TableHeader, TableBody, TableRow, TableColumn, TableCell } from "@heroui/table";
import { Divider } from "@heroui/divider";

interface Member {
  id: any;
  name: string;
  email: string;
  organizations: { name: string; user_has_org_id: number; orgID: number }[];
  created: string;
}

const EditMember: React.FC = () => {
  const [member, setMember] = useState<Member>({
    id: null,
    name: "",
    email: "",
    organizations: [],
    created: "",
  });
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await searchUser(query);

      if (result && Array.isArray(result.response) && result.response.length > 0) {
        const user = result.response[0];
        setMember({
          id: user.id,
          name: user.name || "",
          email: user.email || "",
          organizations: user.user_has_organizations.map((userOrg: any) => ({
            name: userOrg.organizations.name,
            user_has_org_id: userOrg.user_has_org_id,
            orgID: userOrg.organization_id,
          })),
          created: user.created_at || "",
        });
      } else {
        setError("User not found.");
        setMember({ id: null, name: "", email: "", organizations: [], created: "" });
      }
    } catch (err: any) {
      setError(err.message || "Failed to search user.");
      setMember({ id: null, name: "", email: "", organizations: [], created: "" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMember((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setQuery("");
    setMember({ id: null, name: "", email: "", organizations: [], created: "" });
    setError("");
  };

  const columns = [
    { key: "name", label: "Organization Name" },
    { key: "user_has_org_id", label: "User Has Org ID" },
    { key: "orgID", label: "Org ID" },
  ];

  const rows = member.organizations.map((org) => ({
    key: org.user_has_org_id, // Ensure each row has a unique key
    user_has_org_id: org.user_has_org_id,
    orgID: org.orgID,
    name: org.name,
  }));

  const getKeyValue = (item: any, columnKey: any) => {
    return item[columnKey];
  };

  return (
    <div className=" mx-auto space-y-6">
      <Input
        label="Search by Name or Email"
        id="query"
        name="query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter name or email"
        required
        className="w-full"
      />
      <div className="flex flex-cols space-x-3 pt-4">
        <Button variant="bordered" type="button" color="secondary" onClick={handleClear}>
          Clear
        </Button>
        <Button type="button" variant="solid" color="secondary" onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>
  
      {error && <p className="text-red-500">{error}</p>}
  
      {(member.name || member.email || member.organizations.length > 0) && (
        <div>
          <Divider className="my-4" />
          <Form className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Input
              label="ID"
              id="id"
              name="user ID"
              value={member.id ?? ""}
              onChange={handleChange}
              placeholder="ID"
              required
              disabled
            />
              
            <Input
              label="Account created at"
              id="created_at"
              name="created_at"
              value={member.created ? format(new Date(member.created), "MMMM dd, yyyy") : ""}
              onChange={handleChange}
              placeholder="Created At"
              required
              disabled
            />
                <Input
                  label="Name"
                  id="name"
                  name="name"
                  value={member.name}
                  onChange={handleChange}
                  placeholder="Enter user name"
                  required
                />
  
            <Input
              type="email"
              label="Email"
              id="email"
              name="email"
              value={member.email}
              onChange={handleChange}
              placeholder="Enter user email"
              required
            />
  
            <div className="col-span-2">
              <label htmlFor="organization" className="block text-sm text-center mb-4 font-medium">
                Organizations
              </label>
              {member.organizations.length > 0 ? (
                <Table aria-label="Organizations Table">
                  <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                  </TableHeader>
                  <TableBody items={rows}>
                    {(item) => (
                      <TableRow key={item.key}>
                        {(columnKey: any) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500">No organizations found</p>
              )}
            </div>
          </Form>
        </div>
      )}
    </div>
  );
  
};

export default EditMember;
