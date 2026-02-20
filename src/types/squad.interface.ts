import type { IMatch } from "./match.interface";

export interface ISquad {
    _id?: string;
    description?: string;
    title?: string;
    players: { _id?: string; name: string; position: string; avatar?: string }[];
    coach?: { _id?: string; name: string; avatar?: string };
    assistant?: { _id?: string; name: string; avatar?: string };
    match: IMatch;
    createdAt?: string;
    updatedAt?: string;
}