'use client';
import { useState, useMemo } from "react";
import { searchOrg, updateOrgAdmin, removeUserFromDirectlyFromOrg, updateUserRoleAdmin } from "@/app/api/organization-service";
import { Input } from "@heroui/input";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell
} from "@heroui/table";
import { Pagination } from "@heroui/pagination";
import { format } from "date-fns";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import { industries } from "@/common/select-data/industry";
import { languages } from "@/common/select-data/language";
import { Country } from "@/common/select-data/countries";
import { timezones } from "@/common/select-data/timezone";
import { IoPersonRemove } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";



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

const countryOptions = Object.entries(Country).map(([key, value]) => ({
  code: key,
  name: value,
}));


const OrganizationSearch = () => {
  const [query, setQuery] = useState("");
  const [organization, setOrganization] = useState<any>(null);
  const [editableOrg, setEditableOrg] = useState<any>(null); // 👈 added
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
      const foundOrg = data.response[0];
      setOrganization(foundOrg);
      setEditableOrg({ ...foundOrg }); 
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
      role: (
        <Select 
          key={`role-select-${u.email}`} 
          selectedKeys={[u.role]}
          onSelectionChange={(keys) => handleRoleChange(u.email, Array.from(keys)[0] as string, organization.organization_id)}
        >
          <SelectItem key="Owner">Owner</SelectItem>
          <SelectItem key="Admin">Admin</SelectItem>
          <SelectItem key="Product Manager">Product Manager</SelectItem>
          <SelectItem key="Employee">Employee</SelectItem>
          <SelectItem key="Auditor">Auditor</SelectItem>
          <SelectItem key="QA">QA</SelectItem>
        </Select>
      ),
      email: u.email,
      Actions: (
        <div style={{ display: "flex", gap: "8px" }}>
          {u.role !== "Owner" && (
            <Button variant="light" size="sm" onClick={() => handleRemoveFromOrg(u.email, organization.organization_id)} startContent={<IoPersonRemove />
            }>
              Remove from organization
            </Button>
          )}
        </div>
      )
    })) || [];

    const handleRoleChange = (email: string, newRole: string, orgID: number) => {
      // Update both organization and editableOrg states
      updateUserRoleAdmin(email, newRole, orgID)
      setOrganization((prev:any) => ({
        ...prev,
        users: prev.users.map((user:any) => 
          user.email === email ? { ...user, role: newRole } : user
        )
      }));
      
      setEditableOrg((prev:any) => ({
        ...prev,
        users: prev.users.map((user:any) => 
          user.email === email ? { ...user, role: newRole } : user
        )
      }));
    };

const makeTeamRows = () =>
  organization?.teams?.map((t: any, idx: number) => ({
    key: idx.toString(),
    name: t.name,
    Actions: (
        <Button variant="light" size="sm" onClick={() => handleRemoveTeam(t)} startContent={<FaRegTrashAlt />}>
          Delete
        </Button>
    ),
  })) || [];

  const makeTaskRows = () => {
    if (!organization?.projects) return [];
  
    return organization.projects.flatMap((project: any) =>
      project.tasks?.map((task: any, idx: number) => ({
        key: `${project.name}-${idx}`,
        project: project.name,
        name: task.name,
        deadline: task.deadline,
        Actions: (
            <Button variant="light" size="sm" onClick={() => handleDeleteTask(task)} startContent={<FaRegTrashAlt />}>
              Delete
            </Button>
        ),
      })) || []
    );
  };

  const handleRemoveUser = (userEmail: string) => {
  // Logic to remove user from organization
  console.log(`Removing user with email: ${userEmail}`);
  // Update state accordingly
};


const handleEditProject = (project: any) => {
  console.log(`Editing project: ${project.name}`);
};

const handleDeleteProject = (project: any) => {
  console.log(`Deleting project: ${project.name}`);
};

const handleRemoveTeam = (team: any) => {
  console.log(`Removing team: ${team.name}`);
};

const handleDeleteTask = (task: any) => {
  console.log(`Deleting task: ${task.name}`);
};

const handleRemoveFromOrg = async (email: any, orgID: any) =>
{
  try {
    setLoading(true);
    await removeUserFromDirectlyFromOrg(email, orgID);
    await handleSearch();

  } catch (error) {
    console.error("Edit failed:", error);
  } finally {
    setLoading(false);
  }
}

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
      status: getStatusLabel(p.status),
      client: p.client?.name || "N/A",
      actions: (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button variant="light" size="sm" onClick={() => handleEditProject(p)}>
            Edit
          </Button>
          <Button variant="light" size="sm" onClick={() => handleDeleteProject(p)}>
            Delete
          </Button>
        </div>
      ),
    })) || [];


    const renderTable = (title: string, columns: any[], rows: any[], currentPageKey: keyof typeof page) => {
      const totalPages = Math.ceil(rows.length / rowsPerPage);
      const paginated = getPaginatedRows(rows, page[currentPageKey]);
    
      // Add Actions column if the rows have Actions
      const hasActions = paginated.some(row => row.Actions);
      const allColumns = hasActions ? [...columns, { key: "Actions", label: "Actions" }] : columns;
    
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
            <TableHeader columns={allColumns}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={paginated}>
              {(item: any) => (
                <TableRow key={item.key}>
                  {(columnKey) => (
                    <TableCell>
                      {columnKey === "Actions" ? item[columnKey] : item[columnKey]}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      );
    };
    

  const renderOrgDetails = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input value={editableOrg?.organization_id} label="Organization ID" readOnly />
      <Input value={editableOrg?.name || ""} onChange={(e) => handleInputChange("name", e.target.value)} label="Name" />
      <Input value={editableOrg?.organization_address || ""} onChange={(e) => handleInputChange("organization_address", e.target.value)} label="Address" />
      <Input value={editableOrg?.email || ""} onChange={(e) => handleInputChange("email", e.target.value)} label="Email" />
      <Select
        label="Industry"
        selectedKeys={editableOrg?.industry ? [editableOrg.industry] : []}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as string;
          handleInputChange("industry", selected);
        }}
      >
        {/* Add current value manually if not found in the list */}
        {!industries.some(ind => ind.industry_name === editableOrg?.industry) && editableOrg?.industry && (
          <SelectItem key={editableOrg.industry}>
            {editableOrg.industry}
          </SelectItem>
        )}

        {industries.map((industry: any) => (
          <SelectItem key={industry.industry_name}>
            {industry.industry_name}
          </SelectItem>
        ))}
      </Select>

      <Input value={editableOrg?.phone || ""} onChange={(e) => handleInputChange("phone", e.target.value)} label="Phone" />
      <Input value={editableOrg?.website || ""} onChange={(e) => handleInputChange("website", e.target.value)} label="Website" />
      <Select
        label="Country"
        selectedKeys={editableOrg?.country ? [editableOrg.country] : []}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as string;
          handleInputChange("country", selected);
        }}
      >
        {/* Add current country if not found in enum */}
        {!countryOptions.some(c => c.name === editableOrg?.country) && editableOrg?.country && (
          <SelectItem key={editableOrg.country}>
            {editableOrg.country}
          </SelectItem>
        )}

        {countryOptions.map(({ code, name }) => (
          <SelectItem key={name}>
            {name}
          </SelectItem>
        ))}
      </Select>
      <Input value={editableOrg?.state || ""} onChange={(e) => handleInputChange("state", e.target.value)} label="State" />
      <Input value={editableOrg?.city || ""} onChange={(e) => handleInputChange("city", e.target.value)} label="City" />
      <Input value={editableOrg?.zip_code?.toString() || ""} onChange={(e) => handleInputChange("zip_code", e.target.value)} label="Zip Code" />
      <Input value={editableOrg?.founded || ""} onChange={(e) => handleInputChange("founded", e.target.value)} label="Founded" />
      <Select
        label="Language"
        selectedKeys={editableOrg?.language ? [languages.find((lang) => lang.lng === editableOrg.language)?.lng_code || ""] : []}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as string;
          const selectedLanguage = languages.find((lang) => lang.lng_code === selected);
          
          if (selectedLanguage) {
            handleInputChange("language", selectedLanguage.lng); // Save the language name (lng)
          }
        }}
      >
        {languages.map((language) => (
          <SelectItem key={language.lng_code}>
            {language.lng}
          </SelectItem>
        ))}
      </Select>



      <Select
      label="Timezone"
      selectedKeys={editableOrg?.timezone ? [editableOrg.timezone] : []}
      onSelectionChange={(keys) => {
        const selected = Array.from(keys)[0] as string;
        handleInputChange("timezone", selected);
      }}
    >
      {!timezones.some(tz => tz.tz_code === editableOrg?.timezone) && editableOrg?.timezone && (
        <SelectItem key={editableOrg.timezone}>
          {editableOrg.timezone}
        </SelectItem>
      )}

      {timezones.map((timezone) => (
        <SelectItem key={timezone.tz_code}>
          {`${timezone.tz_identifier} (UTC ${timezone.tz_UTC_offset})`}
        </SelectItem>
      ))}
    </Select>
      <Input value={editableOrg?.created_at ? format(new Date(editableOrg.created_at), "MMMM dd, yyyy") : ""} label="Created at" readOnly />
      <Button
          variant="solid"
          size="lg"
          color="primary"
          onClick={handleSaveChanges} // Calls the function to save changes
          className="w-full"
        >
          Save Changes
        </Button>
    </div>
  );


  const handleSaveChanges = async () => {
    setLoading(true);
    setError(null);
    try {
      const updatedOrg = await updateOrgAdmin(editableOrg);
      setOrganization(updatedOrg);  // Update local organization state with the saved changes
      setEditableOrg(updatedOrg);  // Update the editableOrg state as well
      handleSearch();
    } catch (err: any) {
      setError(err.message || "An error occurred while saving changes.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditableOrg((prev: any) => ({
      ...prev,
      [field]: value,
    }));
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
          {renderOrgDetails()}


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
