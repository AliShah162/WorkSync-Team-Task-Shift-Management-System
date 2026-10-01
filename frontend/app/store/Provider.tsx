'use client';

import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './index';
import { login, setHydrated } from './authSlice';
import type { AppDispatch } from './index';

function AuthRehydrator() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRaw = localStorage.getItem('user');

    if (token && userRaw) {
      try {
        const user = JSON.parse(userRaw);
        dispatch(login({ user, token }));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch(setHydrated());
      }
    } else {
      dispatch(setHydrated());   // ⬅️ THIS LINE IS CRITICAL
    }
  }, [dispatch]);

  return null;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthRehydrator />
      {children}
    </Provider>
  );
}