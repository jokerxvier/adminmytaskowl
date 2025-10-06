'use client';

import RegisterBeta from "@/components/betaRegister";
import InvitedUsers from "@/components/invitedUsers";
import { Divider } from "@heroui/divider";

export default function BetaPage(){

    return(
        <div>
            <h1 className="text-2xl font-bold mb-4 ">Beta Program</h1>
            <RegisterBeta/>
            <Divider className="my-4" />
            <h1 className="text-2xl font-bold mb-4 ">Invited Users</h1>
            <InvitedUsers/>
        </div>

    )
}