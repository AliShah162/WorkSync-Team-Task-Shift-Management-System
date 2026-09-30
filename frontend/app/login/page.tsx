'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
// import { AxiosError } from 'axios';
import { api } from '../lib/api';
import { login, type User } from '../store/authSlice';

interface LoginResponse {
  accessToken: string;
  user: User;
}

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
//3 states
  const [email, setEmail] = useState('admin@worksync.com');
  const [password, setPassword] = useState('Password123');
  const [error, setError] = useState('');

 async function handleSubmit(e: React.SubmitEvent) {
  e.preventDefault();
  setError('');

  try {
    const data = await api.post('/auth/login', { email, password });
    console.log('LOGIN RESPONSE:', data);   

    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));

    dispatch(login({ user: data.user, token: data.accessToken }));
    router.push('/');
  } catch (err: any) {
    console.log('LOGIN ERROR:', err);
    setError(err.response?.data?.error?.message || 'Login failed');
  }
}

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded bg-white p-6 shadow"
      >
        <h1 className="mb-4 text-2xl font-bold">Login</h1>

        {error && (
          <p className="mb-3 rounded bg-red-100 p-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 w-full rounded border p-2"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3 w-full rounded border p-2"
        />

        <button
          type="submit"
          className="w-full rounded bg-blue-600 p-2 text-white"
        >
          Login
        </button>
      </form>
    </main>
  );
}