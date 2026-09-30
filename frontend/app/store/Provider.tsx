'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './index';
import { login } from './authSlice';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      store.dispatch(login({ token, user: JSON.parse(user) }));
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}