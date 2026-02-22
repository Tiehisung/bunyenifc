import {   teamBnfc } from "./teamBnfc";
import { ITeam } from "@/types/match.interface";

export const teamKFC: ITeam = {
    _id: teamBnfc.alias,
    name: teamBnfc.name,
    alias: teamBnfc.alias,
    logo: teamBnfc.logo,
    community: "Konjiehi",
    currentPlayers: [],
    contact: "0241508430",
    contactName: "Adam Wahid",
    createdAt: "2023-11-28T10:30:00Z",
    updatedAt: "2023-11-28T10:30:00Z",
};

