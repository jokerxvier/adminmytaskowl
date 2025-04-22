'use client';
import EditMember from "@/components/edit_member";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";

export default function Users() {
    return (
        <div className="p-6">
            <Breadcrumbs variant="solid" radius="full" className="mb-4">
                <BreadcrumbItem>
                    Web App
                </BreadcrumbItem>
                <BreadcrumbItem>
                    Users
                </BreadcrumbItem>
            </Breadcrumbs>
            <h1 className="text-3xl font-bold mb-6">Users</h1>
            <div className="">
                <EditMember />
            </div>
        </div>
    );
}
