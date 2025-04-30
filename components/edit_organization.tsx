'use client';
import { useState, useMemo } from "react";
import { Input } from "@heroui/input";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@heroui/table";
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
import { FaCheckSquare, FaEdit, FaRegTrashAlt, FaTimes, FaTrash, FaUndo } from "react-icons/fa";
import { PasswordVerifyModal } from "./verifyPassword";

import { 
  searchOrg, 
  updateOrgAdmin, 
  removeUserFromDirectlyFromOrg, 
  updateUserRoleAdmin, 
  updateTask, 
  updateProject, 
  updateTeam, 
  toggleStatus, 
  toggleDisableOrg} from "@/app/api/organization-service";
import { addToast } from "@heroui/toast";



const userColumns = [
  { key: "name", label: "User Name" },
  { key: "role", label: "Role" },
  { key: "email", label: "Email" },
];

const teamColumns = [
  { key: "team_id", label: "Team ID" },
  { key: "name", label: "Team Name" },
];

const taskColumns = [
  { key: "task_id", label: "Task ID" },
  { key: "name", label: "Name" },
  { key: "deadline", label: "Deadline" },
  { key: "actions", label: "Actions" },
];

const projectColumns = [
  { key: "project_id", label: "Project ID" },
  { key: "title", label: "Project Title" },
  { key: "status", label: "Status" },
  { key: "client", label: "Client" },
  { key: "actions", label: "Actions" },
];

const countryOptions = Object.entries(Country).map(([key, value]) => ({
  code: key,
  name: value,
}));


const OrganizationSearch = () => {
  const [query, setQuery] = useState("");
  const [organization, setOrganization] = useState<any>(null);
  const [editableOrg, setEditableOrg] = useState<any>(null); 
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

    const [editingProject, setEditingProject] = useState<{
      id: string;
      name: string;
      deadline: string;
    } | null>(null);
    const makeProjectRows = () => {
      if (!organization?.projects) return [];
    
      return organization.projects.map((p: any, idx: number) => {
        const isEditing = editingProject?.id === `${p.name}-${idx}`;
        return {
          key: `${p.name}-${idx}`,
          project_id: p.project_id,
          title: isEditing ? (
            <Input
              isDisabled={organization.is_active === 0}
              value={editingProject.name}
              onChange={(e) =>
                setEditingProject({ ...editingProject, name: e.target.value })
              }
              size="sm"
            />
          ) : (
            <span className={p.is_deleted ? "line-through" : ""}>
              {p.name}
            </span>
          ),
          status: getStatusLabel(p.status),
          client: p.client?.name || "N/A",
          actions: (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    isDisabled={organization.is_active === 0}
                    variant="light"
                    size="sm"
                    onClick={() => {
                      
                      requirePasswordVerification(async () => {
                        updateProject({
                          ...p,
                          name: editingProject.name,
                        });
                        handleSearch();
                        addToast({
                          title: "Project Edited",
                          timeout: 3000,
                          shouldShowTimeoutProgress: true,
                          color: 'success',
                        });
                        setEditingProject(null);
                      }, `Edit ${p.name}`)
                    }}
                    startContent={<FaCheckSquare />}
                  >
                    Save
                  </Button>
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => setEditingProject(null)}
                    startContent={<FaTimes />}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    isDisabled={organization.is_active === 0}

                    variant="light"
                    size="sm"
                    onClick={() =>
                      setEditingProject({
                        id: `${p.name}-${idx}`,
                        name: p.name,
                        deadline: "", // optional if you have it
                      })
                    }
                    startContent={<FaEdit />}
                  >
                    Edit
                  </Button>
                  <Button
                    isDisabled={organization.is_active === 0}

                    variant="light"
                    size="sm"
                    onClick={() => handleDeleteProject(p)}
                    startContent={p.is_deleted === 1 ? <FaUndo /> : <FaRegTrashAlt />}
                    color={p.is_deleted === 1 ? "success" : "danger"}
                  >
                    {p.is_deleted === 1 ? 'Restore' : 'Delete'}
                  </Button>
                </>
              )}
            </div>
          ),
        };
      });
    };
    

    const [editingTeam, setEditingTeam] = useState<{
      id: string;
      name: string;
    } | null>(null);

    const makeTeamRows = () =>
      organization?.teams?.map((team: any, idx: number) => {
        const isEditing = editingTeam?.id === `${team.name}-${idx}`;
        return {
          key: `${team.name}-${idx}`,
          team_id: team.team_id,
          name: isEditing ? (
            <Input
            isDisabled={organization.is_active === 0}
              value={editingTeam.name}
              onChange={(e) =>
                setEditingTeam({ ...editingTeam, name: e.target.value })
              }
              size="sm"
            />
          ) : (
            <span 
            className={team.is_deleted ? "line-through text-gray-400" : ""}
            style={team.is_deleted ? { textDecoration: 'line-through' } : {}}
          >
            {team.name}
            {team.is_deleted === true && (
              <span className="ml-2 text-xs text-red-500">(Archived)</span>
            )}          
            </span>
          ),
          Actions: (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    isDisabled={organization.is_active === 0}
                    variant="light"
                    size="sm"
                    onClick={() => {
                      requirePasswordVerification(async () => {
                        updateTeam({
                          ...team,
                          name: editingTeam.name,
                        });
                        handleSearch();
                        setEditingTeam(null);
                        addToast({
                          title: "Team Edited",
                          timeout: 3000,
                          shouldShowTimeoutProgress: true,
                          color: 'success',
                        });
                      },`Edit ${team.name}`)
                    }}
                    startContent={<FaCheckSquare />}
                  >
                    Save
                  </Button>
                  <Button
                  isDisabled={organization.is_active === 0}
                    variant="light"
                    size="sm"
                    onClick={() => setEditingTeam(null)}
                    startContent={<FaTimes />}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                  isDisabled={organization.is_active === 0}
                    variant="light"
                    size="sm"
                    onClick={() =>
                      setEditingTeam({
                        id: `${team.name}-${idx}`,
                        name: team.name,
                      })
                    }
                    startContent={<FaEdit />}
                  >
                    Edit
                  </Button>
                  <Button
                  isDisabled={organization.is_active === 0}
                    variant="light"
                    size="sm"
                    onClick={() => 
                      requirePasswordVerification(async () => {
                        handleRemoveTeam(team);
                        handleSearch();
                        addToast({
                          title: "Team Disabled",
                          timeout: 3000,
                          shouldShowTimeoutProgress: true,
                          color: 'success',
                        });
                      },
                    `Disable or Re-enable ${team.name}`)}
                    startContent={team.is_deleted === 1 ? <FaUndo /> : <FaRegTrashAlt />}
                    color={team.is_deleted === 1 ? "success" : "danger"}
                  >
                    {team.is_deleted === 1 ? 'Restore' : 'Delete'}
                  </Button>
                </>
              )}
            </div>
          ),
        };
      }) || [];
    

  const [editingTask, setEditingTask] = useState<{
    id: string;
    name: string;
    deadline: string;
  } | null>(null);

  const makeTaskRows = () => {
    if (!organization?.projects) return [];
  
      return organization.projects.flatMap((project: any) =>
      project.tasks?.map((task: any, idx: number) => {
        const isEditing = editingTask?.id === `${project.name}-${idx}`;
          return {
            key: `${project.name}-${idx}`,
            task_id: task.task_id,
            name: isEditing ? (
              <Input
              isDisabled={organization.is_active === 0}
                value={editingTask.name}
                onChange={(e) => setEditingTask({
                  ...editingTask,
                  name: e.target.value
                })}
                size="sm"
              />
            ) : (
              <span 
                className={task.status ? "line-through text-gray-400" : ""}
                style={task.status ? { textDecoration: 'line-through' } : {}}
              >
                {task.name}
                {task.status === true && (
                  <span className="ml-2 text-xs text-red-500">(Archived)</span>
                )}          
              </span>
            ),
            deadline: isEditing ? (
              <Input
              isDisabled={organization.is_active === 0}
                type="date"
                value={editingTask.deadline}
                onChange={(e) => setEditingTask({
                  ...editingTask,
                  deadline: e.target.value
                })}
                size="sm"
              />
            ) : (
              task.deadline
            ),
            Actions: (
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                    isDisabled={organization.is_active === 0}
                      variant="light"
                      size="sm"
                      onClick={() => {
                        requirePasswordVerification(async () => {
                          updateTask({
                            ...task,
                            name: editingTask.name,
                            deadline: editingTask.deadline
                          });
                          handleSearch()
                          addToast({
                            title: "Task Edited",
                            timeout: 3000,
                            shouldShowTimeoutProgress: true,
                            color: 'success',
                          });
                          setEditingTask(null);
                        }, `Edit ${task.name}`)
                       
                      }}
                      startContent={<FaCheckSquare />}
                    >
                      Save
                    </Button>
                    <Button
                    isDisabled={organization.is_active === 0}
                      variant="light"
                      size="sm"
                      onClick={() => setEditingTask(null)}
                      startContent={<FaTimes />}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                    isDisabled={organization.is_active === 0}
                      variant="light"
                      size="sm"
                      onClick={() => setEditingTask({
                        id: `${project.name}-${idx}`,
                        name: task.name,
                        deadline: task.deadline
                      })}
                      startContent={<FaEdit />}
                    >
                      Edit
                    </Button>
                    <Button
                    isDisabled={organization.is_active === 0}
                      variant="light"
                      size="sm"
                      onClick={() => handleDeleteTask(task)}
                      startContent={task.status === 1 ? <FaUndo /> : <FaRegTrashAlt />}
                      color={task.status === 1 ? "success" : "danger"}
                    >
                      {task.status === 1 ? 'Restore' : 'Delete'}
                    </Button>
                  </>
                )}
              </div>
            )
          };
        }) || []
      );

    };

    // Password verification state
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<{
      action: () => Promise<void>;
      description: string;
    } | null>(null);
  
    // Helper function to require password verification
    const requirePasswordVerification = (action: () => Promise<void>, description: string) => {
      setPendingAction({ action, description });
      setIsVerifyModalOpen(true);
    };
  
    // Modified handlers with password verification
    const handleSaveChanges = () => {
      requirePasswordVerification(async () => {
        setLoading(true);
        setError(null);
        try {
          const updatedOrg = await updateOrgAdmin(editableOrg);
          setOrganization(updatedOrg);
          setEditableOrg(updatedOrg);
        } catch (err: any) {
          setError(err.message || "Failed to save changes");
        } finally {
          setLoading(false);
        }
      }, "save organization changes");
    };
  
    const handleRemoveFromOrg = (email: any, orgID: any) =>
      requirePasswordVerification(async () => {
        try {
          setLoading(true);
          await removeUserFromDirectlyFromOrg(email, orgID);
          await handleSearch();
    
        } catch (error) {
          console.error("Edit failed:", error);
        } finally {
          setLoading(false);
        }
      }, "handle remove org")
       
      
  
    const handleRoleChange = (email: string, newRole: string, orgID: number) => {
      requirePasswordVerification(async () => {
        await updateUserRoleAdmin(email, newRole, orgID);
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
        handleSearch();
        addToast({
          title: `${email}'s role changed`,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          color: 'success',
        });
      }, `change ${email}'s role to ${newRole}`);
    };
  

  const handleDeleteProject = (project: any) => {
    requirePasswordVerification(async () => {
      try {
        const result = await toggleStatus('project', project.project_id, project.organization_id);
        handleSearch();
        addToast({
          title: "Project Disabled",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          color: 'success',
        });
      } catch (error) {
        console.error('Failed to toggle project status:', error);
      }
    }, 'Restore or Delete Project')
  };

  const handleRemoveTeam = (team: any) => {
    console.log(`Removing team: ${team.name}`);
    requirePasswordVerification(async () => {
      try {
        const result = await toggleStatus('team', team.team_id, team.organization_id);
        handleSearch();
        addToast({
          title: "Team Disabled",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          color: 'success',
        });
      } catch (error) {
        console.error('Failed to toggle project status:', error);
      }
    }, 'Restore or Delete Team')
  };

  const handleDeleteTask = (task: any) => {
    console.log(`Deleting task: ${task.name}`);
    requirePasswordVerification(async () => {
      try {
        const result = await toggleStatus('task', task.task_id, task.organization_id);
        handleSearch();
        addToast({
          title: "Task Disabled",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          color: 'success',
        });
      } catch (error) {
        console.error('Failed to toggle project status:', error);
      }
    }, 'Restore or Delete Project')
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






    const renderTable = (title: string, columns: any[], rows: any[], currentPageKey: keyof typeof page) => {
    const totalPages = Math.ceil(rows.length / rowsPerPage);
    const paginated = getPaginatedRows(rows, page[currentPageKey]);
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
            <TableBody items={paginated} emptyContent={"No data to display."}>
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
      <Input isDisabled={organization.is_active === 0} value={editableOrg?.organization_id} label="Organization ID" readOnly  />
      <Input isDisabled={organization.is_active === 0} value={editableOrg?.name || ""} onChange={(e) => handleInputChange("name", e.target.value)} label="Name" />
      <Input isDisabled={organization.is_active === 0} value={editableOrg?.organization_address || ""} onChange={(e) => handleInputChange("organization_address", e.target.value)} label="Address" />
      <Input isDisabled={organization.is_active === 0} value={editableOrg?.email || ""} onChange={(e) => handleInputChange("email", e.target.value)} label="Email" />
      <Select
        isDisabled={organization.is_active === 0} 
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

      <Input isDisabled={organization.is_active === 0} value={editableOrg?.phone || ""} onChange={(e) => handleInputChange("phone", e.target.value)} label="Phone" />
      <Input isDisabled={organization.is_active === 0} value={editableOrg?.website || ""} onChange={(e) => handleInputChange("website", e.target.value)} label="Website" />
      <Select
        isDisabled={organization.is_active === 0}
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
      <Input isDisabled={organization.is_active === 0} value={editableOrg?.state || ""} onChange={(e) => handleInputChange("state", e.target.value)} label="State" />
      <Input isDisabled={organization.is_active === 0} value={editableOrg?.city || ""} onChange={(e) => handleInputChange("city", e.target.value)} label="City" />
      <Input isDisabled={organization.is_active === 0} value={editableOrg?.zip_code?.toString() || ""} onChange={(e) => handleInputChange("zip_code", e.target.value)} label="Zip Code" />
      <Input isDisabled={organization.is_active === 0}value={editableOrg?.founded || ""} onChange={(e) => handleInputChange("founded", e.target.value)} label="Founded" />
      <Select
        isDisabled={organization.is_active === 0}
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
      isDisabled={organization.is_active === 0}
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
      <Input isDisabled={organization.is_active === 0} value={editableOrg?.created_at ? format(new Date(editableOrg.created_at), "MMMM dd, yyyy") : ""} label="Created at" readOnly />
      <Button
          isDisabled={organization.is_active === 0}
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
          {organization.is_active === 0 && (
            <h2 className="text-2xl font-semibold text-center text-danger mb-4">Organization Disabled</h2>
          )}
          {renderOrgDetails()}


          {/* User Table */}
          {renderTable("Users", userColumns, makeUserRows(), "users")}
          {renderTable("Projects", projectColumns, makeProjectRows(), "projects")}
          {renderTable("Teams", teamColumns, makeTeamRows(), "teams")}
          {renderTable("Tasks", taskColumns, makeTaskRows(), "tasks")}

          <Button
            color="danger"
            startContent={<FaTrash />}
            onClick={() => {
              requirePasswordVerification(async () => {
                await toggleDisableOrg(organization.organization_id);
                handleSearch();
                addToast({
                  title: organization.is_active ? "Organization Disabled" : "Organization Re-enabled",
                  timeout: 3000,
                  shouldShowTimeoutProgress: true,
                  color: organization.is_active ? 'danger' : 'success',
                });
              }, `Confirm ${organization.is_active ? 'Disable' : 'Re-enable'} Organization`);
            }}
          >
            {organization.is_active ? `Disable ${organization.name}` : `Re-enable ${organization.name}`}
          </Button>
      </div>
      )}
    </div>
    
    <PasswordVerifyModal
        isOpen={isVerifyModalOpen}
        onOpenChange={setIsVerifyModalOpen}
        onVerified={() => {
          if (pendingAction) {
            pendingAction.action();
          }
        }}
        title="Confirm Action"
        description={pendingAction?.description || ""}
      />
    </Card>

  );
};

export default OrganizationSearch;
