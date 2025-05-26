"use client";
import { Input } from "@heroui/input";
import {
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Modal,
} from "@heroui/modal";
import {RadioGroup, Radio} from "@heroui/radio";

import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { useEffect, useState } from "react";
import { searchOrg } from "@/app/api/organization-service";
import { addUserToOrg } from "@/app/api/organization-service";
import { addToast } from "@heroui/toast";
import { on } from "events";
import { Select, SelectItem } from "@heroui/select";

interface AddToOrgModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
  selectedMember:any;
}


export const AddToOrgModal = ({
  isOpen,
  onOpenChange,
  onSuccess,
  selectedMember,
  title = "Add User to Organization",
  description = "Enter the user's email to add them to your organization",
}: AddToOrgModalProps) => {
  const [role, setRole] = useState("member"); // Default role
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [organization, setOrganization] = useState<any>(null);
    const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrgID, setSelectedOrgID] = useState<number | null>(null);


  const handleSubmit = async () => {
    try {
        const data = await addUserToOrg(selectedMember.id, selectedOrgID, role);
        if(data){
        onSuccess();
        }
    }
   catch (err: any) {
        setError(
          err.message || "An error occurred while searching for organizations.",
        );
    } 
    finally {
    setLoading(false);
    }
}

    const handleSearch = async () => {
console.log("selectedMember", selectedMember);

      if (!query) return;
      setLoading(true);
      setError(null);
      try {
        const data = await searchOrg(query);
        const foundOrg = data.response;
  
        setOrganization(foundOrg);
      } catch (err: any) {
        setError(
          err.message || "An error occurred while searching for organizations.",
        );
      } finally {
        setLoading(false);
      }
    };

  return (// In AddToOrgModal component


    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
            {`Add ${selectedMember?.name || 'user'} to an organization`}

              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}

              <Input
                placeholder="Search by organization name"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <Button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                disabled={loading}
                onClick={handleSearch}
            > Search 
            </Button>


            {organization && (
            <RadioGroup 
                label="Select Organization"
                value={selectedOrgID?.toString()} 
                onValueChange={(value) => setSelectedOrgID(Number(value))}
                className="space-y-4"
            >
                {organization.map((org: any) => {
                const isUserInOrg = selectedMember?.organizations?.some(
                    (userOrg: any) => userOrg.orgID === org.organization_id
                );
                
                return (
                    <Radio
                    key={org.organization_id}
                    value={org.organization_id.toString()}
                    isDisabled={isUserInOrg}
                    classNames={{
                        base: [
                        "grid-grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                        "border-transparent",
                        "data-[selected=true]:border-primary"
                        ],
                        label: [
                        "w-full",
                        isUserInOrg ? "text-default-200" : "text-default-700"
                        ],
                        description: "text-default-500 text-xs",
                        wrapper: [
                        isUserInOrg ? "text-default-200" : "text-default-700"
                        ]
                    }}
                    >
                    <div className="flex flex-col">
                        <p><strong>ID:</strong> {org.organization_id}</p>
                        <p><strong>Name:</strong> {org.name}</p>
                        <p><strong>Email:</strong> {org.email}</p>
                        {isUserInOrg && (
                        <span className="text-xs text-default-500">
                            (User is already in this organization)
                        </span>
                        )}
                    </div>
                    </Radio>
                );
                })}
            </RadioGroup>
            )}

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Role</label>
                <Select
                label="Role"
                selectedKeys={[role]}
                onChange={(e) => setRole(e.target.value)}
                className="w-full"
                >
                <SelectItem key="Admin">
                    Admin
                </SelectItem>
                <SelectItem key="QA" >
                    QA
                </SelectItem>
                <SelectItem key="Auditor" >
                    Auditor
                </SelectItem>
                <SelectItem key="Product Manager" >
                    Manager
                </SelectItem>
                <SelectItem key="Employee">
                    Employee
                </SelectItem>
                </Select>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                disabled={isLoading}
                variant="light"
                onPress={onClose}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                disabled={isLoading}
                endContent={isLoading ? <Spinner size="sm" /> : null}
                onPress={handleSubmit}
              >
                {isLoading ? "Adding..." : "Add User"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};