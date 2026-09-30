import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type User = {//this came from backend
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'employee';
};
//So User describes the shape of data the backend gives you. If the backend adds a avatar field tomorrow, you'd add it here too.

type AuthState = {
  user: User | null;
  token: string | null;
};

const initialState: AuthState = { user: null, token: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;