import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    user: any | null;
    token: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
};

const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        setCredentials(state, action: PayloadAction<AuthState>) {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        logout(state) {
            state.user = null;
            state.token = null;
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;