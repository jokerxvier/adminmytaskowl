'use client';
import { useState, useMemo } from "react";
import { searchOrg } from "@/app/api/organization-service";
import { Input } from "@heroui/input";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell
} from "@heroui/table";
import { Pagination } from "@heroui/pagination";
import { format } from "date-fns";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";

const userColumns = [
  { key: "name", label: "User Name" },
  { key: "role", label: "Role" },
  { key: "email", label: "Email" },
];

const teamColumns = [
  { key: "name", label: "Team Name" },
];

const taskColumns = [
  { key: "name", label: "Name" },
  { key: "deadline", label: "Deadline" },
];

const projectColumns = [
  { key: "title", label: "Project Title" },
  { key: "status", label: "Status" },
  { key: "client", label: "Client" },
];

const OrganizationSearch = () => {
  const [query, setQuery] = useState("");
  const [organization, setOrganization] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState({ users: 1, teams: 1, tasks: 1, projects: 1 });
  const rowsPerPage = 5;

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchOrg(query);
      setOrganization(data.response[0]);
      setPage({ users: 1, teams: 1, tasks: 1, projects: 1 });
    } catch (err: any) {
      setError(err.message || "An error occurred while searching for organizations.");
    } finally {
      setLoading(false);
    }
  };

  const getPaginatedRows = (data: any[], currentPage: number) => {
    const start = (currentPage - 1) * rowsPerPage;
    return data?.slice(start, start + rowsPerPage) || [];
  };

  const makeUserRows = () =>
    organization?.users?.map((u: any) => ({
      key: u.email,
      name: u.name,
      role: u.role,
      email: u.email,
    })) || [];

  const makeTeamRows = () =>
    organization?.teams?.map((t: any, idx: number) => ({
      key: idx.toString(),
      name: t.name,
    })) || [];

    const makeTaskRows = () => {
        if (!organization?.projects) return [];
      
        return organization.projects.flatMap((project: any) =>
          project.tasks?.map((task: any, idx: number) => ({
            key: `${project.name}-${idx}`,
            project: project.name,
            name: task.name,
            deadline: task.deadline,
          })) || []
        );
      };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0:
        return "Not Started";
      case 1:
        return "Completed";
      case 2:
        return "In Progress";
      default: 
        return "N/A";
    };
  }
  const makeProjectRows = () =>
    organization?.projects?.map((p: any, idx: number) => ({
      key: idx.toString(),
      title: p.name,
      status: getStatusLabel(p.status) ,
      client: p.client?.name || "N/A",
      actions: (
        <div style={{ display: "flex", gap: "8px" }}> {/* Adjusting space between buttons */}
          <Button 
            variant="light"
            size="sm"
          >
            Edit
          </Button>
          <Button 
            variant="light"
            size="sm"
          >
            Delete
          </Button>
        </div>
      ),
    })) || [];


  const renderTable = (title: string, columns: any[], rows: any[], currentPageKey: keyof typeof page) => {
    const totalPages = Math.ceil(rows.length / rowsPerPage);
    const paginated = getPaginatedRows(rows, page[currentPageKey]);

    return (
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Table
          isStriped
          selectionMode="none"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page[currentPageKey]}
                total={totalPages}
                onChange={(newPage) => setPage(prev => ({ ...prev, [currentPageKey]: newPage }))}
              />
            </div>
          }
        >
          <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
          </TableHeader>
          <TableBody items={paginated}>
            {(item: any) => (
              <TableRow key={item.key}>
                {(columnKey) => <TableCell>{item[columnKey]}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Card className="my-4 p-4">
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Search Organizations</h1>

      <div className="flex flex-col space-y-4">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by organization name"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Searching..." : "Search"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </div>

      {organization && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Organization Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input value={organization.organization_id} label="Organization ID" readOnly />
            <Input value={organization.name} label="Name" readOnly />
            <Input value={organization.organization_address} label="Address" />
            <Input value={organization.email} label="Email"  />
            <Input value={organization.industry} label="Industry"  />
            <Input value={organization.phone} label="Phone"  />
            <Input value={organization.website} label="Website"  />
            <Input value={organization.country} label="Country"  />
            <Input value={organization.state} label="State"  />
            <Input value={organization.city} label="City"  />
            <Input value={organization.zip_code?.toString()} label="Zip Code"  />
            <Input value={organization.founded} label="Founded"  />
            <Input value={organization.language} label="Language" />
            <Input value={organization.timezone} label="Timezone" />
            <Input value={format(new Date(organization.created_at), "MMMM dd, yyyy")} label="Created at"  />
            <Button
            variant="solid"
            size="lg"
            color="secondary">
              Save Changes
            </Button>
          </div>

          {/* User Table */}
          {renderTable("Users", userColumns, makeUserRows(), "users")}
          {renderTable("Projects", projectColumns, makeProjectRows(), "projects")}

          {/* Grid of 3 tables: Teams, Tasks, Projects */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderTable("Teams", teamColumns, makeTeamRows(), "teams")}
            {renderTable("Tasks", taskColumns, makeTaskRows(), "tasks")}
          </div>
        </div>
      )}
    </div>
    </Card>

  );
};

export default OrganizationSearch;
