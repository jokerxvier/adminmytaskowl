"use client";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";

import EditMember from "@/components/edit_member";

export default function Users() {
  return (
    <div className="p-6">
      <Breadcrumbs className="mb-4" radius="full" variant="solid">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/web-app">Web App</BreadcrumbItem>
        <BreadcrumbItem>Users</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <div className="">
        <EditMember />
      </div>
    </div>
  );
}
