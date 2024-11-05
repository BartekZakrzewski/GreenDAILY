"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/auth";
import { useParams } from "next/navigation";
import EcoScore from "@/components/components/ui/piechart";
import Link from "next/link";
import pb from "@/lib/pocketbase";
import { Button } from "@/components/components/ui/button";

const UserDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userEcoScore, setUserEcoScore] = useState(0);
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    useEffect(() => {
        const user = pb.authStore.model;
        if (user && user.id == id) {
            setIsAuthenticated(true);

            const fetchEcoScore = async () => {
                try {
                    const records = await pb
                        .collection("GetEcoScore")
                        .getFullList()
                        .then((res) =>
                            res.filter((record) => record.user_id == user.id),
                        );
                    setUserEcoScore(records[0].ecoscore);
                } catch (err) {
                    console.log(err.originalError);
                }
            };
            fetchEcoScore();
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const handleLogout = async (e) => {
        try {
            await logoutUser();
            router.push("/");
        } catch (error) {
            throw new Error(error.message);
        }
    };
    console.log(isAuthenticated);
    if (!isAuthenticated) {
        return (
            <div className="h-svh flex items-center justify-center">
                <Link
                    href="/auth/signup"
                    className="bg-green-900 py-3 px-5 items-center rounded-md text-white"
                >
                    Sign up
                </Link>
            </div>
        );
    }
    return (
        <>
            <EcoScore userEcoScore={userEcoScore} />
        </>
    );
};

export default UserDashboard;
