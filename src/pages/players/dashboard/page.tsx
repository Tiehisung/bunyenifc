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
import { TEAM } from "@/data/teamBnfc";
import { useGetGalleriesQuery } from "@/services/gallery.endpoints";
import { useAppSelector } from "@/store/hooks/store";
import DataErrorAlert from "@/components/error/DataError";
import { PageSEO } from "@/utils/PageSEO";

export default function PlayerDashboardPage() {
  const { user } = useAppSelector((s) => s.auth);

  const {
    data: playerData,
    isLoading: playerLoading,
    error: playerError,
    isFetching,
    refetch,
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
          <DataErrorAlert
            message={playerError}
            onRefetch={refetch}
            isRefreshing={isFetching}
          />
        </div>
      </div>
    );
  }

  const title = `${player?.lastName} | ${TEAM.name} player`;
  const description = player?.about || "Player dashboard from bunyenifc.";

  return (
    <>
      <PageSEO
        page="players"
        title={title}
        description={description}
        image={player?.avatar}
        url={window.location.href}
      />

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
                  <div className="text-muted-foreground" dangerouslySetInnerHTML={{__html:player?.about || "No description available."}}/>
                  
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
