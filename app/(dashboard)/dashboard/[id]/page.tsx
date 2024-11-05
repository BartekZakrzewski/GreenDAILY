"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EcoScore from "@/components/components/ui/piechart";
import { buttonVariants } from "@/components/components/ui/button"
import Link from "next/link";
import pb from "@/lib/pocketbase";

const UserDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [userEcoScore, setUserEcoScore] = useState<any>();
    const { id } = useParams<{ id: string }>();
    useEffect(() => {
        const _user = pb.authStore.model;
        
        if (_user && _user.id == id) {
            setIsAuthenticated(true);
            setUser(_user);
            const fetchEcoScore = async () => {
                try {
                    const records = await pb
                        .collection("GetEcoScore")
                        .getFullList()
                        .then((res) =>
                            res.filter((record) => record.user_id == _user.id),
                        );
                    setUserEcoScore(records[0]);
                } catch (err) {
                    throw new Error(err.message)
                }
            };
            fetchEcoScore();
        } else {
            setIsAuthenticated(false);
        }
    }, [id]);

    if (!isAuthenticated) {
        return (
            <div className='flex items-center justify-center gap-2 sm:gap-0 sm:grid sm:grid-cols-2 sm:items-center sm:px-2 text-sm sm:text-base text-nowrap'>
                <Link href="/auth/login">Log in</Link>
                <Link className={`${buttonVariants({ variant: "_default"})}`} href="/auth/signup" >Sign up</Link>
            </div>
        );
    }
    return (
        <main className="flex flex-col">
            <h1 className="font-extrabold p-6 text-xl italic text-center border-b-[1px] border-opacity-5">{ user.email }</h1>
            <section className="flex flex-col">
                <div className="flex flex-col items-center">
                    <EcoScore userEcoScore={userEcoScore?.ecoscore} />
                    <Link className={buttonVariants({ variant: "default"})} href={`/dashboard/${id}/${userEcoScore?.id}`}>Calculate your <span className="text-green-400 italic">Eco Score</span></Link>
                </div>
                <div>

                </div>
            </section>
        </main>
    );
};

export default UserDashboard;
