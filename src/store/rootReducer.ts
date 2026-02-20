import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import authReducer from "../features/auth/auth.slice";
import { api } from "../services/api";

const rootReducer = combineReducers({
    auth: authReducer,
    [api.reducerPath]: api.reducer,
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: ['authSlice'], // ⭐  Only persist API cache
    blacklist: ['someTempReducer'], // Don't persist temporary data
};

export const persistedReducer =
    persistReducer(persistConfig, rootReducer);