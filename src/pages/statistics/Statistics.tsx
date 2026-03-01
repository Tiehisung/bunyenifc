import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FC } from "react";
import { EPlayerPosition,  } from "@/types/player.interface";
import { computePlayerStandings } from "@/lib/compute/player/standings";
import HEADER from "@/components/Element";
import { AVATAR } from "@/components/ui/avatar";
import { useGetPlayersQuery } from "@/services/player.endpoints";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PlayerStatistics = () => {
  const { data: playersData, isLoading, error } = useGetPlayersQuery('');
  const players = playersData;

  if (isLoading) {
    return (
      <div className="_page px-5">
        <HEADER
          title="Player Statistics"
          subtitle="Top performers this season"
        />
        <div className="flex justify-center items-center min-h-100">
          <Loader message="Loading player statistics..." />
        </div>
      </div>
    );
  }

  if (error || !players?.data?.length) {
    return (
      <div className="_page px-5">
        <HEADER
          title="Player Statistics"
          subtitle="Top performers this season"
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Data Available</AlertTitle>
          <AlertDescription>
            Unable to load player statistics at this time.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const standings = computePlayerStandings(players?.data || []);

  return (
    <div className="_page px-5">
      <HEADER title="Player Statistics" subtitle="Top performers this season" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <PlayerStatsCard
          title="Goals"
          alias="goals"
          featuredPlayer={
            standings.topScorers[0]
              ? {
                  ...standings.topScorers[0],
                  number: standings.topScorers[0]?.number || 0,
                  statsValue: standings.topScorers[0]?.goals?.toString() || "0",
                }
              : null
          }
          otherPlayers={standings.topScorers?.slice(1, 6)?.map((p) => ({
            ...p,
            statsValue: p?.goals?.toString() || "0",
          }))}
        />
        <PlayerStatsCard
          title="Assists"
          alias="assists"
          featuredPlayer={
            standings.topAssists[0]
              ? {
                  ...standings.topAssists[0],
                  number: standings.topAssists?.[0]?.number || 0,
                  statsValue:
                    standings.topAssists?.[0]?.assists?.toString() || "0",
                }
              : null
          }
          otherPlayers={standings.topAssists?.slice(1, 6)?.map((p) => ({
            ...p,
            statsValue: p?.assists?.toString() || "0",
          }))}
        />
        <PlayerStatsCard
          title="Appearances"
          alias="matches"
          featuredPlayer={
            standings.topAppearances[0]
              ? {
                  ...standings.topAppearances[0],
                  number: standings.topAppearances?.[0]?.number || 0,
                  statsValue:
                    standings.topAppearances?.[0]?.appearances?.toString() ||
                    "0",
                }
              : null
          }
          otherPlayers={standings.topAppearances?.slice(1, 6)?.map((p) => ({
            ...p,
            statsValue: p?.appearances?.toString() || "0",
          }))}
        />
      </div>
    </div>
  );
};

export default PlayerStatistics;

export interface IPlayerStatsProps {
  title: string;
  alias: string;
  featuredPlayer: {
    _id: string;
    name: string;
    avatar: string;
    position: EPlayerPosition;
    goals: number;
    assists: number;
    appearances: number;
    number: number;
    statsValue: string;
  } | null;
  otherPlayers: {
    _id: string;
    name: string;
    avatar: string;
    position: EPlayerPosition;
    goals: number;
    assists: number;
    appearances: number;
    number: number;
    statsValue: string;
  }[];
}

export const PlayerStatsCard: FC<IPlayerStatsProps> = ({
  alias,
  featuredPlayer,
  otherPlayers,
  title,
}) => {
  return (
    <Card className="min-w-60 border _borderColor rounded-lg p-4 container">
      {/* Header */}
      <CardHeader className="text-lg font-bold mb-4 text-yellow-500 uppercase">
        {title}
      </CardHeader>

      {/* Featured Player */}
      {featuredPlayer ? (
        <CardHeader className="flex items-center mb-6">
          <AVATAR
            src={featuredPlayer?.avatar as string}
            alt={featuredPlayer?.name ?? ""}
            fallbackText={featuredPlayer?.name ?? ""}
            className="w-20 h-20 rounded-full mr-4"
          />
          <div>
            <h4 className="text-lg font-bold">{featuredPlayer?.name}</h4>
            <p className="text-2xl font-semibold text-Blue">
              {`${featuredPlayer?.statsValue} ${alias}`}
            </p>
          </div>
        </CardHeader>
      ) : (
        <CardHeader className="flex items-center mb-6">
          <p className="text-muted-foreground">No data available</p>
        </CardHeader>
      )}

      {/* Other Players */}
      <CardContent className="space-y-3">
        {otherPlayers?.length > 0 ? (
          otherPlayers?.map((player, index) => (
            <div
              key={player._id || index}
              className="flex justify-between items-center border-b border-border pb-3"
            >
              <div className="flex items-center space-x-3">
                <AVATAR
                  src={player?.avatar as string}
                  alt={player?.name as string}
                  fallbackText={player?.name as string}
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-sm font-medium">{player?.name}</span>
              </div>
              <span className="text-lg font-bold">{player?.statsValue}</span>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-center py-4">
            No other players
          </p>
        )}
      </CardContent>
    </Card>
  );
};
