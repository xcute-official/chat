import React from "react";
import Sidebar from "../components/sidebar/Sidebar";
import getUsers from "../actions/getUsers";
import { UserList } from "./components/UserList";

export default async function UsersLayout({
    children
}: {children: React.ReactNode;}){
    const users = await getUsers();
    return (
        // // @ts-expect-error Server Component, you can write this if below sidebar issues
        <Sidebar>
            <div className="h-full">
                <UserList items={users!} />
                {children}
            </div>
        </Sidebar>
    )
}