import { Button } from '@heroui/button';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import React, { useState } from 'react';

interface Organization {
  name: string;
  email: string;
  invitation: string;
}


const EditOrganization: React.FC = () => {
  const [organization, setOrganization] = useState<Organization>({
    name: '',
    email: '',
    invitation: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrganization((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updated Member:', organization);
    // Add logic to save the updated member information
  };

  return (
    <Form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
      <Input
        label="Name"
        id="name"
        name="name"
        value={organization.name}
        onChange={handleChange}
        required
        placeholder="Enter organization name"
      />

      <Input
        type="email"
        label="Email"
        id="email"
        name="email"
        value={organization.email}
        onChange={handleChange}
        required
        placeholder="Enter organization email"
      />

      <Input
        label="Organization"
        id="organization"
        name="organization"
        value={organization.invitation}
        onChange={handleChange}
        placeholder="Enter organization invitation code"
      />
      <div className="flex flex-cols justify-center items-center space-x-3 pt-4">
        <Button variant="bordered" type="button" color="secondary">
          Clear
        </Button>
        <Button type="submit" variant="solid" color="secondary">
          Search
        </Button>
      </div>
    </Form>
  );
};

export default EditOrganization;