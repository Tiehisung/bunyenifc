import { IPlayer } from "@/types/player.interface";
import PlayerProfile from "./Profile";
import { PlayerHeadList } from "./PlayerHeadList";
import { useSearchParams } from "react-router-dom";

import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGetGalleriesQuery } from "@/services/gallery.endpoints";
import { useGetPlayersQuery, useGetPlayerStatsQuery } from "@/services/player.endpoints";
import { PageSEO } from "@/utils/PageSEO";
import { TEAM } from "@/data/teamBnfc";

export default function PlayerProfilePage() {
  const [searchParams] = useSearchParams();
  const playerId = searchParams.get("playerId");

  const { data: playersData, isLoading: playersLoading } =
    useGetPlayersQuery("");
  const { data: galleriesData, isLoading: galleriesLoading } =
    useGetGalleriesQuery(`tags=${playerId}`);
  const { data: statsData, isLoading: statsLoading } = useGetPlayerStatsQuery(
    playerId || "",
  );

  const isLoading = playersLoading || galleriesLoading || statsLoading;
  const players = playersData;
  const galleries = galleriesData;
  const playerStats = statsData;

  const player = players?.data?.find((p) => p._id === playerId);

  if (isLoading) {
    return (
      <main className="_page flex justify-center items-center min-h-100">
        <Loader message="Loading player profile..." />
      </main>
    );
  }


  if (!player) {
    return (
      <main className="_page p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Player Not Found</AlertTitle>
          <AlertDescription>
            The player you're looking for doesn't exist or has been removed.
          </AlertDescription>
        </Alert>
      </main>
    );
  }

  const name = `${player?.firstName} ${player?.lastName}`;
  const title = `${name} - ${player?.position} | ${TEAM.name}`;
  const description = `Player profile for ${name}. ${player?.position} wearing jersey #${player?.number}. Stats, appearances, goals, and career highlights.`;

  return (
    <>
      <PageSEO page="players" title={title} description={description} />

      <main className="_page">
        <div
          className="h-screen w-full z-[-1] fixed inset-0 bottom-0 bg-no-repeat bg-cover"
          style={{
            backgroundImage: `url(${
              player?.featureMedia?.[0]?.secure_url ?? player?.avatar
            })`,
          }}
        />
        <PlayerProfile
          players={players?.data as IPlayer[]}
          galleries={galleries?.data}
          stats={playerStats?.data}
        />
        <PlayerHeadList players={players?.data as IPlayer[]} />
      </main>
    </>
  );

 
}
