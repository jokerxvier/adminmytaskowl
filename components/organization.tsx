import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import React, { useState } from "react";

interface Organization {
  name: string;
  email: string;
  invitation: string;
}

const EditOrganization: React.FC = () => {
  const [organization, setOrganization] = useState<Organization>({
    name: "",
    email: "",
    invitation: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setOrganization((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated Member:", organization);
    // Add logic to save the updated member information
  };

  return (
    <Form className="max-w-md mx-auto space-y-6" onSubmit={handleSubmit}>
      <Input
        required
        id="name"
        label="Name"
        name="name"
        placeholder="Enter organization name"
        value={organization.name}
        onChange={handleChange}
      />

      <Input
        required
        id="email"
        label="Email"
        name="email"
        placeholder="Enter organization email"
        type="email"
        value={organization.email}
        onChange={handleChange}
      />

      <Input
        id="organization"
        label="Organization"
        name="organization"
        placeholder="Enter organization invitation code"
        value={organization.invitation}
        onChange={handleChange}
      />
      <div className="flex flex-cols justify-center items-center space-x-3 pt-4">
        <Button color="secondary" type="button" variant="bordered">
          Clear
        </Button>
        <Button color="secondary" type="submit" variant="solid">
          Search
        </Button>
      </div>
    </Form>
  );
};

export default EditOrganization;
