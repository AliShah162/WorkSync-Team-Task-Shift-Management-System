'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [departmentId, setDepartmentId] = useState(1);
  const [error, setError] = useState('');
  import axios from 'axios';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');


try {
  await api.post('/auth/register', { name, email, password, departmentId });
  router.push('/login');
} catch (err) {
  if (axios.isAxiosError(err)) {
    setError(err.response?.data?.error?.message || 'Registration failed');
  } else {
    setError('Something went wrong');
  }
}

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-bold">Register</h1>

        {error && <p className="mb-3 rounded bg-red-100 p-2 text-sm text-red-700">{error}</p>}

        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}
          className="mb-3 w-full rounded border p-2" />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="mb-3 w-full rounded border p-2" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="mb-3 w-full rounded border p-2" />
        <input type="number" placeholder="Department ID" value={departmentId}
          onChange={(e) => setDepartmentId(Number(e.target.value))}
          className="mb-3 w-full rounded border p-2" />

        <button type="submit" className="w-full rounded bg-blue-600 p-2 text-white">
          Register
        </button>

        <p className="mt-3 text-sm">
          Have an account? <a href="/login" className="text-blue-600">Login</a>
        </p>
      </form>
    </main>
  );
}