 
import { IPlayerStatsProps } from "@/pages/statistics/Statistics";
import { IFileProps } from "@/types/file.interface";
import { EMatchStatus } from "@/types/match.interface";
import { IPlayerMini } from "@/types/player.interface";
import { ISquad } from "@/types/squad.interface";



export interface IMatchProps {
  _id: string;
  comment?: string;
  title: string;
  date: string;
  time: string;
  opponent: ITeamProps;
  broadcaster?: IFileProps;
  status: EMatchStatus;
  score: { kfc: number; opponent: number };
  isHome: boolean;
  venue?: { name: string; files: IFileProps[] };
  goals: Array<IGoal>;
  opponentGoals: number
  events: Array<IMatchEvent>;
  cards: Array<IMatchCard>;
  squad?: ISquad
}

export interface IMatchCard {
  type: 'red' | 'yellow';
  minute: string | number
  match: { name: string, _id: string }
  player: IPlayerMini
  description?: string
}
export interface IMatchEvent {
  title: string,
  description?: string;
  minute: string | number,
  type: 'goal' | 'card' | 'injury' | 'general'
}


export interface ITeamProps {
  _id: string;
  name: string;
  community: string;
  alias: string;
  contact: string;
  contactName: string;
  logo: string;
  currentPlayers: IPlayerStatsProps[];
  createdAt: string;
  updatedAt: string;
}

export interface IGoal {
  _id?: string;
  opponent: string; //ObjectId of team
  minute: string | number;
  scorer: IPlayerMini;
  assist?: IPlayerMini;
  modeOfScore?:
  | "Open Play Goal"
  | "Set Piece Goal"
  | "Penalty Goal"
  | "Own Goal"
  | "Counter-Attack Goal"
  | "Header Goal"
  | "Volley Goal"
  | "Tap-In Goal"
  | "Long-Range Goal"
  description?: string
  match: string
}


