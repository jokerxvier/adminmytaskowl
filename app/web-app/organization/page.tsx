"use client";

import OrganizationSearch from "@/components/edit_organization";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";

export default function Organization() {
  return (
    <div className="flex flex-col w-full h-full">
      <Breadcrumbs className="mb-4" radius="full" variant="solid">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/web-app">Web App</BreadcrumbItem>
        <BreadcrumbItem>Organization</BreadcrumbItem>
      </Breadcrumbs>
      <div className="flex flex-col w-full h-full">
        <h1 className="text-2xl font-bold">Organization Management</h1>
        <p className="text-gray-600">
          Manage organizations, teams, roles, and permissions.
        </p>
        <OrganizationSearch />
      </div>
    </div>
  );
}
