'use client'

import OrganizationSearch from "@/components/edit_organization";

export default function Organization(){
    return (
        <div className="flex flex-col w-full h-full">
        <div className="flex flex-col w-full h-full">
            <h1 className="text-2xl font-bold">Organization Management</h1>
            <p className="text-gray-600">Manage organizations, teams, roles, and permissions.</p>
            <OrganizationSearch />
        </div>
        </div>
    );
}