import { IMatch, ITeam } from "@/types/match.interface";
import { checkTeams, checkMatchMetrics } from "@/lib/compute/match";
import { MatchEventsAdmin } from "../live-match/EventsUpdator";
import MatchActions from "./Actions";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router-dom";
 
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGetMatchQuery } from "@/services/match.endpoints";
import { useGetPlayersQuery } from "@/services/player.endpoints";
import { useGetTeamsQuery } from "@/services/team.endpoints";

export default function MatchPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: matchData, isLoading: matchLoading } = useGetMatchQuery(
    slug || "",
  );
  const { data: playersData, isLoading: playersLoading } = useGetPlayersQuery('');
  const { data: teamsData, isLoading: teamsLoading } = useGetTeamsQuery({});

  const isLoading = matchLoading || playersLoading || teamsLoading;
  const match = matchData?.data;
  const players = playersData;
  const teams = teamsData;

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 _page">
        <div className="flex justify-center items-center min-h-100">
          <Loader message="Loading match details..." />
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="container mx-auto p-4 _page">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Match Not Found</AlertTitle>
          <AlertDescription>
            The match you're looking for doesn't exist or has been removed.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { home, away } = checkTeams(match);
  const matchMetrics = checkMatchMetrics(match);

  return (
    <div className="container mx-auto p-4 _page">
      <h1 className="text-2xl font-bold mb-4 text-primaryRed">
        {match?.title} <Badge className="ml-auto">{match?.status}</Badge>
      </h1>
      <MatchActions
        match={match}
        matches={[]} // You'll need to fetch matches separately if needed
        teams={teams?.data as ITeam[]}
        players={players?.data}
      />
      <div className="my-6 flex items-center justify-between gap-6">
        <img
          src={home?.logo as string}
          alt={home?.name ?? ""}
          className="aspect-square h-16 w-16 sm:h-24 sm:w-24 object-cover"
        />
        <div className="flex flex-col justify-center items-center">
          <div className="text-xl md:text-2xl font-black uppercase">
            {home?.name}
          </div>
          {match?.status === "UPCOMING" ? (
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
        <img
          src={away?.logo as string}
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
