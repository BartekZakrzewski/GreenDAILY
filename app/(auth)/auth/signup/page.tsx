"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createEcoScore, signupUser } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/components/ui/button";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signupUser(email, password, passwordConfirm);
      router.push("/auth/login"); // Redirect to login page after signup
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (password !== passwordConfirm) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError(null);
    }
  }, [passwordConfirm]);

  return (
    <div className="min-h-svh flex items-center justify-center">
      <div
        className="flex flex-col items-center bg-slate-700 justify-center p-10 gap-4 rounded-xl"
        style={{
          backgroundColor: "rgba(20, 83, 45, .75)",
        }}
      >
        <h1 className="font-extrabold text-2xl underline">Signup</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={5}
            required
          />
          <Input
            type="password"
            placeholder="Password Confirm"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
          <Button type="submit">Signup</Button>
        </form>
        {passwordError && (
          <p className="text-red-500 font-bold">{passwordError}</p>
        )}
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}
