"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EcoScore from "@/components/components/ui/piechart";
import { Button, buttonVariants } from "@/components/components/ui/button";
import Link from "next/link";
import pb from "@/lib/pocketbase";
import { createEcoJournal, getEcoJournal, getEcoScore, updateEcoJournal, updateEcoScore } from "@/lib/auth";
import { Calendar } from "@/components/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const UserDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [userEcoScore, setUserEcoScore] = useState<any>();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [ecoJournalContent, setEcoJournalContent] = useState<string>();
    const [ecoJournal, setEcoJournal] = useState<{[key: string]: string}[]>();
    const { toast } = useToast();
    const { id } = useParams<{ id: string }>();

     useEffect(() => {
        const _user = pb.authStore.model;

        if (_user && _user.id == id) {
            setUser(_user);
            setIsAuthenticated(true);
            const fetchEcoScore = async () => {
                const record = await getEcoScore(_user);
                setUserEcoScore(record);
            }
            fetchEcoScore();
            const fetchEcoJournal = async () => {
                const records = await getEcoJournal(_user);
                setEcoJournal(records);
            }
            fetchEcoJournal();
        } else {
            setIsAuthenticated(false);
        }
    }, [id]);

    useEffect(() => {
        if(ecoJournal && selectedDate != undefined && ecoJournal.filter((item) => item.date == selectedDate.toISOString().slice(0, 10)).length != 0) {
            setEcoJournalContent(ecoJournal.filter((item) => item.date == selectedDate.toISOString().slice(0, 10)).at(0).content);
        } else {
            setEcoJournalContent("");
        }
    }, [selectedDate])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(ecoJournal && selectedDate != undefined) {
            if(ecoJournal.filter((item) => item.date == selectedDate.toISOString().slice(0, 10)).length != 0) {
                const record = await updateEcoJournal(ecoJournal.filter((item) => item.date == selectedDate.toISOString().slice(0, 10)).at(0).id, ecoJournalContent);
            } else {
                const record = await createEcoJournal(ecoJournalContent, selectedDate.toISOString().slice(0, 10), user.id);
            }
        }

        toast({
          title: `${selectedDate.toISOString().slice(0, 10)}`,
          description: "Your journal has been updated",
        })

        const fetchEcoJournal = async () => {
            const records = await getEcoJournal(user);
            setEcoJournal(records);
        }
        fetchEcoJournal();
    }

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
                <div className="flex flex-col md:flex-row mt-10 justify-center items-center md:px-16 bg-slate-700/30">
                    <Calendar mode="single" className="w-min" selected={selectedDate} onSelect={setSelectedDate} footer={ 
                        selectedDate ? `Selected: ${selectedDate.toISOString().slice(0, 10)}` : "Pick a day."
                    } />
                    <div className="w-full h-full">
                        <form onSubmit={handleSubmit} className="flex flex-col space-y-8">
                            <Textarea value={ecoJournalContent} onChange={(e) => setEcoJournalContent(e.target.value)} placeholder={`Write about you eco habits on ${selectedDate && selectedDate.toISOString().slice(0, 10)} here`} />
                            <Button type="submit">Update Journal</Button>
                        </form>
                    </div>
                </div>
            </section>
            <Toaster />
        </main>
    );
};

export default UserDashboard;
