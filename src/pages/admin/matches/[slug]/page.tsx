import { IPlayer } from "@/types/player.interface";
import { IPageProps, IQueryResponse } from "@/types";
import { IMatch, ITeam } from "@/types/match.interface";
import { checkTeams, checkMatchMetrics } from "@/lib/compute/match";
import { getPlayers } from "../../players/page";
import { getTeams } from "../../teams/page";
import Image from "next/image";
import { getMatchById, getMatches } from "../page";
import { MatchEventsAdmin } from "../live-match/EventsUpdator";
import MatchActions from "./Actions";
import { Badge } from "@/components/ui/badge";

export default async function MatchPage({ params }: IPageProps) {
  const slug = (await params)?.slug as string;
  const match: IMatch = await getMatchById(slug);

  const players: IQueryResponse<IPlayer[]> = await getPlayers();
  const teams: IQueryResponse<ITeam[]> = await getTeams();
  const matches: IQueryResponse<IMatch[]> = await getMatches();

  const { home, away } = checkTeams(match);
  const matchMetrics = checkMatchMetrics(match);

  if (!match)
    return (
      <div className="_title text-Red rounded-2xl text-center my-14 mx-6 _page">
        Match not found
      </div>
    );

  return (
    <div className="container mx-auto p-4 _page">
      <h1 className="text-2xl font-bold mb-4 text-primaryRed">
        {match?.title} <Badge className="ml-auto">{match?.status}</Badge>
      </h1>
      <MatchActions
        match={match}
        matches={matches?.data}
        teams={teams?.data as ITeam[]}
        players={players?.data}
      />
      <div className="my-6 flex items-center justify-between gap-6">
        <Image
          src={home?.logo as string}
          width={200}
          height={200}
          alt={home?.name ?? ""}
          className="aspect-square h-16 w-16 sm:h-24 sm:w-24 object-cover"
        />
        <div className=" flex flex-col justify-center items-center">
          <div className="text-xl md:text-2xl font-black uppercase">
            {home?.name}
          </div>
          {match?.status == "UPCOMING" ? (
            <div className="font-semibold text-xl">VS</div>
          ) : (
            <div className="mx-auto text-2xl text-center">
              {matchMetrics?.goals?.home ?? 0} -{" "}
              {matchMetrics?.goals?.away ?? 0}
            </div>
          )}

          <div className="text-xl md:text-2xl font-black uppercase">
            {away?.name}
          </div>
        </div>
        <Image
          src={away?.logo as string}
          width={200}
          height={200}
          alt={away?.name ?? ""}
          className="aspect-square h-16 w-16 sm:h-24 sm:w-24 object-cover"
        />
      </div>

      <br />

      {match && (
        <MatchEventsAdmin
          players={players?.data}
          opponent={match?.opponent as ITeam}
          match={match as IMatch}
        />
      )}
    </div>
  );
}
