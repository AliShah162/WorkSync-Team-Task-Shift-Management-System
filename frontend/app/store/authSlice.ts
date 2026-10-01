import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'employee';
};

type AuthState = {
  user: User | null;
  token: string | null;
  hydrated: boolean;   // ← NEW
};

const initialState: AuthState = {
  user: null,
  token: null,
  hydrated: false,     // ← NEW
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.hydrated = true;    // ← NEW
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.hydrated = true;    // ← NEW
    },
    setHydrated: (state) => {
      state.hydrated = true;    // ← NEW (used when there's nothing to rehydrate)
    },
  },
});

export const { login, logout, setHydrated } = authSlice.actions;
export default authSlice.reducer;