import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayerHeader } from "./Header";
import { PlayerInjuryAndIssues } from "./InjuryAndIssues";
import { PerformanceTabs } from "./Performance";
import { PlayerSidebar } from "./Sidebar";
import { StatsCards } from "./Stats";
import { PositionVisualization } from "./PositionVisualization";
import { IGallery } from "@/types/file.interface";
import GalleryGrid from "@/components/Gallery/GallaryGrid";
import { Link } from "react-router-dom";
import { PlayerFeatureMedia } from "./FeatureMedia";
import { useGetPlayerQuery } from "@/services/player.endpoints";

import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Helmet } from "react-helmet";
import { TEAM } from "@/data/teamBnfc";
import { useGetGalleriesQuery } from "@/services/gallery.endpoints";
import { useAppSelector } from "@/store/hooks/store";

export default function PlayerPage() {
  const {user} = useAppSelector(s=>s.auth);

  const {
    data: playerData,
    isLoading: playerLoading,
    error: playerError,
  } = useGetPlayerQuery(user?.email || "");

  const { data: galleriesData, isLoading: galleriesLoading } =
    useGetGalleriesQuery(`tags=${playerData?.data?._id}&limit=3`, {
      skip: !playerData?.data?._id,
    });

  const isLoading = playerLoading || galleriesLoading;
  const player = playerData?.data;
  const galleries = galleriesData;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-accent p-4 md:p-8 pt-20 md:pt-20">
        <div className="max-w-7xl mx-auto flex justify-center items-center min-h-100">
          <Loader message="Loading player dashboard..." />
        </div>
      </div>
    );
  }

  if (playerError || !player) {
    return (
      <div className="min-h-screen bg-accent p-4 md:p-8 pt-20 md:pt-20">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {playerError ? "Failed to load player data" : "Player not found"}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const title = `${player?.lastName} | ${TEAM.name}`;
  const description = player?.about || "Player dashboard from bunyenifc.";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={player?.avatar || TEAM.logo} />
        <meta property="og:site_name" content={TEAM.name} />
        <meta property="og:type" content="profile" />
        <meta property="profile:first_name" content={player?.firstName} />
        <meta property="profile:last_name" content={player?.lastName} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={player?.avatar || TEAM.logo} />
      </Helmet>

      <div className="min-h-screen bg-accent p-4 md:p-8 pt-20 md:pt-20">
        <div className="max-w-7xl mx-auto">
          <PlayerHeader player={player} />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <PlayerSidebar player={player} />
              <PositionVisualization player={player} />
            </div>

            {/* Main content */}
            <div className="lg:col-span-3 space-y-8">
              <StatsCards player={player} />

              <PlayerInjuryAndIssues player={player} />

              <PerformanceTabs player={player} />

              {/* About Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About Player</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {player?.about || "No description available."}
                  </p>
                </CardContent>
              </Card>

              <PlayerFeatureMedia player={player} />

              {/* Gallery Section */}
              <div className="pb-4 space-y-3">
                <GalleryGrid galleries={galleries?.data as IGallery[]} />
                <Link
                  to={`/players/dashboard/galleries?playerId=${player?._id}`}
                  className="pl-4"
                >
                  More Galleries
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
