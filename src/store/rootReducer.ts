import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import authReducer from "./slices/auth.slice";
import playerReducer from './slices/player.slice'
import { api } from "../services/api";
import tempDataReducer from './slices/index'

const rootReducer = combineReducers({
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    player: playerReducer,
    tempData: tempDataReducer
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: ['auth', 'api', 'player', 'tempData'], // ⭐  Only persist API cache
    blacklist: ['someTempReducer'], // Don't persist temporary data
};

export const persistedReducer =
    persistReducer(persistConfig, rootReducer);