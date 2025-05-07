'use client';
import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { searchUser, editUser, removeUserFromOrg, toggleDisableUser } from "@/app/api/user-service";
import { format } from "date-fns";
import { Table, TableHeader, TableBody, TableRow, TableColumn, TableCell } from "@heroui/table";
import { Divider } from "@heroui/divider";
import { IoPersonRemove } from "react-icons/io5";
import { Card } from "@heroui/card";
import { PasswordVerifyModal } from "./verifyPassword";
import { addToast } from "@heroui/toast";

interface Member {
  id: any;
  name: string;
  email: string;
  organizations: { 
    name: string; 
    user_has_org_id: number; 
    orgID: number; 
    is_active: any;
  }[];
  created: string;
  is_active: any;
}

const EditMember: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setSelectedMember(null);

    try {
      const result = await searchUser(query);

      if (result && Array.isArray(result.response) && result.response.length > 0) {
        const mappedMembers = result.response.map((user: any) => ({
          id: user.id,
          name: user.name || "",
          email: user.email || "",
          organizations: user.user_has_organizations_admin?.map((userOrg: any) => ({
            name: userOrg.organizations.name,
            user_has_org_id: userOrg.user_has_org_id,
            orgID: userOrg.organization_id,
            is_active: userOrg.is_active
          })) || [],
          created: user.created_at || "",
          is_active: user.is_active,
        }));
        setMembers(mappedMembers);
      } else {
        setError("No users found.");
        setMembers([]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to search users.");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMember = (member: Member) => {
    setSelectedMember(member);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedMember) return;
    const { name, value } = e.target;
    setSelectedMember(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleClear = () => {
    setQuery("");
    setMembers([]);
    setSelectedMember(null);
    setError("");
  };

  const columns = [
    { key: "name", label: "Organization Name" },
    { key: "user_has_org_id", label: "User Has Org ID" },
    { key: "orgID", label: "Org ID" },
    { key: "actions", label: "Actions" },
  ];

  const handleRemove = (org: any) =>
    requirePasswordVerification(async () => {
      try {
        setLoading(true);
        await removeUserFromOrg(org);
        await handleSearch();
        addToast({
          title: "Removed/Restored from organization",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          color: 'success',
        });
      } catch (error) {
        console.error("Edit failed:", error);
      } finally {
        setLoading(false);
      }
    }, `Remove or Readd from ${org.name}`);

  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    action: () => Promise<void>;
    description: string;
  } | null>(null);

  const requirePasswordVerification = (action: () => Promise<void>, description: string) => {
    setPendingAction({ action, description });
    setIsVerifyModalOpen(true);
  };
  
  const handleEdit = (user: Member) => 
    requirePasswordVerification(async () => {
      try {
        setLoading(true);
        await editUser(user);
        await handleSearch();
        addToast({
          title: `${user.name} information edited`,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          color: 'success',
        });
      } catch (error) {
        console.error("Edit failed:", error);
      } finally {
        setLoading(false);
      }
    }, `Edit ${user.name}'s information`);
  
  const handleToggleUserStatus = (user_id: any) =>
    requirePasswordVerification(async () => {
      try {
        setLoading(true);
        await toggleDisableUser(user_id);
        await handleSearch();
        addToast({
          title: `User Disabled/Re-enabled`,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          color: 'danger',
        });
      } catch (error) {
        console.error("Edit failed:", error);
      } finally {
        setLoading(false);
      }
    }, `Disable or Enable Users`);

  const rows = selectedMember?.organizations?.map((org) => ({
    key: org.user_has_org_id,
    user_has_org_id: org.user_has_org_id,
    orgID: org.orgID,
    name: (
      <span className={org.is_active === 0 ? "line-through" : ""}>
        {org.name}
      </span>
    ),
    actions: (
      <Button
        color={org.is_active === 1 ? "danger" : "success"}
        variant="light"
        size="sm"
        isDisabled={selectedMember?.is_active === 0}  
        onClick={() => handleRemove(org)}
      >
        <IoPersonRemove size={20} />
        {org.is_active === 0 ? "Re-add to Organization" : "Remove from Organization"}
      </Button>
    ),
  })) || [];

  const getKeyValue = (item: any, columnKey: any) => {
    return item[columnKey];
  };

  return (
    <div className="mx-auto space-y-6">
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

      {/* Search Results List */}
      {members.length > 0 && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Search Results</h3>
          <div className="grid grid-cols-2 gap-2">
            {members.map(member => (
              <button 
                key={member.id}
                className={`p-4 cursor-pointer bg-default-200 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  selectedMember?.id === member.id ? 'border-2 border-blue-500' : ''
                }`}
                onClick={() => handleSelectMember(member)}
              >
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <h4 className="font-medium">{member.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{member.email}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    member.is_active === 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {member.is_active === 0 ? 'Disabled' : 'Active'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Selected Member Details */}
      {selectedMember && (
        <Card className="my-4 p-4">
          <span className="text-lg text-center block">
            {selectedMember.is_active === 0 
              ? `${selectedMember.name}'s Account is Disabled` 
              : `${selectedMember.name} User Information`}
          </span>
          
          <Form className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Input
              label="ID"
              id="id"
              name="user ID"
              value={selectedMember.id ?? ""}
              onChange={handleChange}
              placeholder="ID"
              required
              disabled
            />
              
            <Input
              label="Account created at"
              id="created_at"
              name="created_at"
              value={selectedMember.created ? format(new Date(selectedMember.created), "MMMM dd, yyyy") : ""}
              onChange={handleChange}
              placeholder="Created At"
              required
              disabled
              isDisabled={selectedMember.is_active === 0}
            />
            <Input
              label="Name"
              id="name"
              name="name"
              value={selectedMember.name}
              onChange={handleChange}
              placeholder="Enter user name"
              required
              isDisabled={selectedMember.is_active === 0}
            />
            <Input
              type="email"
              label="Email"
              id="email"
              name="email"
              value={selectedMember.email}
              onChange={handleChange}
              placeholder="Enter user email"
              required
              isDisabled={selectedMember.is_active === 0}
            />
            <Button
              variant="solid"
              color={selectedMember.is_active === 1 ? "danger" : "success"}
              onClick={() => handleToggleUserStatus(selectedMember.id)}
            >
              {selectedMember.is_active === 1 ? "Disable User" : "Re-active User"}
            </Button>
            <Button
              variant="solid"
              color="secondary"
              onClick={() => handleEdit(selectedMember)}
              disabled={loading}
              isDisabled={selectedMember.is_active === 0}
            >
              Save Changes
            </Button>
            <Divider className="col-span-2 my-4" />
          
            <div className="col-span-2">
              <label htmlFor="organization" className="block text-sm text-center mb-4 font-medium">
                Organizations
              </label>
              {selectedMember.organizations.length > 0 ? (
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
        </Card>
      )}

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
    </div>
  );
};

export default EditMember;