import type { IMatch } from "./match.interface";
import type { IPlayerMini, EPlayerPosition } from "./player.interface";

 

export interface IMVP {
    _id: string;
    player: IPlayerMini,
    match: IMatch,
    description?: string,
    date?: string
    positionPlayed?: EPlayerPosition

    createdAt?: string;
    updatedAt?: string;
}