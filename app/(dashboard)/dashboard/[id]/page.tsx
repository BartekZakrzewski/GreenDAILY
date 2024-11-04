"use client";

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/auth";
import { useParams } from 'next/navigation'
import pb from '@/lib/pocketbase';

const UserDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    useEffect(() => {
        const user = pb.authStore.model;
        if (user && user.id == id) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const handleLogout = async (e) => {
        try {
            await logoutUser();
            router.push('/');
        } catch (error) {
            throw new Error(error.message)
        }
    }
    console.log(isAuthenticated)
    if (!isAuthenticated) {
        return <p>Not authenticated</p>
    }
    return (
        <form onSubmit={handleLogout}>
            <button type="submit">Log out</button>
        </form>
    )
}

   

export default UserDashboard
