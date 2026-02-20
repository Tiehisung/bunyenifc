import type { EUserRole } from "./user";

export interface ILogin {
    email: string,
    password: string
}

export interface ISignup {
    image?: string
    name: string;
    email: string;
    role?: EUserRole;
    password?: string;
}