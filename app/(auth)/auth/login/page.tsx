"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await loginUser(email, password);
      router.push(`/dashboard/${data.record.id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className='min-h-svh flex items-center justify-center'>
      <div className="flex flex-col items-center bg-slate-700 justify-center p-10 gap-4 rounded-xl" style={{
      backgroundColor: "rgba(20, 83, 45, .75)"
      }}>
        <h1 className="font-extrabold text-2xl underline">Log In</h1>
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
            required
          />
          <Button type="submit">Login</Button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}

