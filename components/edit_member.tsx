'use client';
import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { searchUser, editUser, removeUserFromOrg, toggleDisableUser} from "@/app/api/user-service";
import { format } from "date-fns";
import { Table, TableHeader, TableBody, TableRow, TableColumn, TableCell } from "@heroui/table";
import { Divider } from "@heroui/divider";
import { IoPersonRemove } from "react-icons/io5";
import { Card } from "@heroui/card";
import { PasswordVerifyModal } from "./verifyPassword";


interface Member {
  id: any;
  name: string;
  email: string;
  organizations: { name: string; user_has_org_id: number; orgID: number, is_active: any;
   }[];
  created: string;
  is_active: any;
}

const EditMember: React.FC = () => {
  const [member, setMember] = useState<Member>({
    id: null,
    name: "",
    email: "",
    organizations: [],
    created: "",
    is_active: null,
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
          organizations: user.user_has_organizations_admin.map((userOrg: any) => ({
            name: userOrg.organizations.name,
            user_has_org_id: userOrg.user_has_org_id,
            orgID: userOrg.organization_id,
            is_active: userOrg.is_active
          })),
          created: user.created_at || "",
          is_active: user.is_active,
        });
      } else {
        setError("User not found.");
        setMember({ id: null, name: "", email: "", organizations: [], created: "", is_active: null });
      }
    } catch (err: any) {
      setError(err.message || "Failed to search user.");
      setMember({ id: null, name: "", email: "", organizations: [], created: "", is_active: null });
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
    setMember({ id: null, name: "", email: "", organizations: [], created: "", is_active: null });
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
  
      } catch (error) {
        console.error("Edit failed:", error);
      } finally {
        setLoading(false);
      }
    }, `Remove or Readd from ${org.name}`)

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
    
    const handleEdit = (user: any) => 
      requirePasswordVerification(async () => {
        try {
          setLoading(true);
          await editUser(user);
          handleSearch();
        } catch (error) {
          console.error("Edit failed:", error);
        } finally {
          setLoading(false);
        }
      }, `Edit ${user.name}'s information`)
      
    
      const handleToggleUserStatus = (user_id: any) =>
        requirePasswordVerification(async () => {
          try {
            setLoading(true);
            await toggleDisableUser(user_id);
            handleSearch();
          } catch (error) {
            console.error("Edit failed:", error);
          } finally {
            setLoading(false);
          }
        }, `Disable or Enable Users`)


  const rows = member.organizations.map((org) => ({
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
        isDisabled={member.is_active === 0}  

        onClick={() => handleRemove(org)}
      >
        <IoPersonRemove size={20} />
        {org.is_active === 0 ? "Re-add to Organization" : "Remove from Organization"}
      </Button>
    ),
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
          <Card className="my-4 p-4">
            <span className="text-lg text-center">
            {member.is_active === 0? `${member.name}'s Account is Disabled` : `${member.name} User Information`}  
              </span>
              
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
                isDisabled={member.is_active === 0}  

              />
                  <Input
                    label="Name"
                    id="name"
                    name="name"
                    value={member.name}
                    onChange={handleChange}
                    placeholder="Enter user name"
                    required
                    isDisabled={member.is_active === 0}  

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
                isDisabled={member.is_active === 0}  
                />
              <Button
              variant="solid"
              color={member.is_active === 1 ? "danger" : "success"}
              onClick={() =>handleToggleUserStatus(member.id)}>
                {member.is_active === 1 ? "Disable User" : "Re-active User"}
              </Button>
              <Button
                variant="solid"
                color="secondary"
                onClick={() => handleEdit(member) }
                disabled={loading}
                isDisabled={member.is_active === 0}  
                >
                  Save Changes
              </Button>
              <Divider className="col-span-2 my-4" />
            
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
