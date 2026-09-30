import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: { auth: authReducer },
});

export type RootState = ReturnType<typeof store.getState>;//this is the typescript  method
export type AppDispatch = typeof store.dispatch;