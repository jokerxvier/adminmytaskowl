import { Button } from '@heroui/button';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import React, { useState } from 'react';

interface Member {
  name: string;
  email: string;
  organization: string;
}

const roles = ['admin', 'editor', 'viewer'];

const EditMember: React.FC = () => {
  const [member, setMember] = useState<Member>({
    name: '',
    email: '',
    organization: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMember((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updated Member:', member);
    // Add logic to save the updated member information
  };

  return (
    <Form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
      <Input
        label="Name"
        id="name"
        name="name"
        value={member.name}
        onChange={handleChange}
        required
        placeholder="Enter user name"
      />

      <Input
        type="email"
        label="Email"
        id="email"
        name="email"
        value={member.email}
        onChange={handleChange}
        required
        placeholder="Enter user email"
      />

      <Input
        label="Organization"
        id="organization"
        name="organization"
        value={member.organization}
        onChange={handleChange}
        required
        placeholder="Enter organization"
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

export default EditMember;