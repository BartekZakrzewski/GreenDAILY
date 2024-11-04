"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import pb from "@/lib/pocketbase";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/auth";

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{[key: string]: any}>();
  const router = useRouter();
  useEffect(() => {
    const user = pb.authStore.model;

    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = async (e) => {
    try {
      await logoutUser();
      setIsAuthenticated(false);
      router.push('/');
    } catch (error) {
      throw new Error(error.message)
    }
  }

  return (
    <header className="w-full flex flex-wrap justify-between p-2 border-b-2 border-slate-500/10 bg-slate-500/20 sticky">
      <Link href="/" className="sm:text-2xl my-auto">
        Green<span className="uppercase text-green-900 font-extrabold">daily</span>
      </Link>
      <div className={`${isAuthenticated ? 'hidden' : 'flex items-center justify-center gap-2 sm:gap-0 sm:grid sm:grid-cols-2 sm:items-center sm:px-2 text-sm sm:text-base text-nowrap'}`}>
        <Link href="/auth/login">Log in</Link>
        <Link href="/auth/signup" className="bg-green-900 py-3 px-5 items-center rounded-md text-white">Sign up</Link>
      </div>
      <div className={`${!isAuthenticated ? 'hidden' : 'flex items-center justify-center gap-2 sm:gap-0 sm:grid sm:grid-cols-2 sm:items-center sm:px-2 text-sm sm:text-base text-nowrap'}`}>
        <Link href={`/dashboard/${currentUser ? currentUser.id : ''}`}>Dashboard</Link>
        <form onSubmit={handleLogout} className="bg-green-900 py-3 px-5 items-center rounded-md text-white">
          <button type="submit">Log out</button>
        </form>
      </div>
    </header>
  );
};

export default Header;
