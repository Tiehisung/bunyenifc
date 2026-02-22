
import PlayerFeatureStatsCard from "./PlayerStatsCard";
import { AnimateOnView } from "@/components/Animate/AnimateOnView";
import { useGetPlayersQuery } from "@/services/player.endpoints";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function FeaturedPlayers() {
  const { data: playersData, isLoading, error } = useGetPlayersQuery('');
  const players = playersData;

  if (isLoading) {
    return (
      <section className="_page flex flex-wrap gap-4 items-start justify-center">
        <Loader message="Loading players..." />
      </section>
    );
  }

  if (error || !players?.data?.length) {
    return (
      <section className="_page flex flex-wrap gap-4 items-start justify-center">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Players Found</AlertTitle>
          <AlertDescription>
            Unable to load featured players at this time.
          </AlertDescription>
        </Alert>
      </section>
    );
  }

  // Filter only players with featureImage
  const featuredPlayers = players?.data?.filter(
    (pl) => pl?.featureMedia?.[0]?.secure_url,
  );

  if (!featuredPlayers.length) {
    return null;
  }

  return (
    <section className="_page flex flex-wrap gap-4 items-start justify-center">
      {featuredPlayers?.map((player, index) => {
        const name = `${player?.firstName} ${player?.lastName}`;
        return (
          <AnimateOnView index={index} key={player._id}>
            <PlayerFeatureStatsCard
              name={name}
              position={player.position}
              avatar={player.avatar}
              playerImage={
                player?.featureMedia?.[0]?.secure_url ?? player.avatar
              }
              goals={player.goals?.length}
              matches={player.matches?.length}
              assists={player.assists?.length}
              passAccuracy={player.passAcc?.length}
              trophies={player.trophies}
            />
          </AnimateOnView>
        );
      })}
    </section>
  );
}
