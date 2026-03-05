import { PlayerGalleriesClient } from "./Galleries";
import HEADER from "@/components/Element";
 
import { useSearchParams } from "react-router-dom";
 
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGetGalleriesQuery } from "@/services/gallery.endpoints";
import { useGetPlayerQuery } from "@/services/player.endpoints";
import { useAppSelector } from "@/store/hooks/store";

const PlayerGalleries = () => {
const { user } = useAppSelector((s) => s.auth);
  const [searchParams] = useSearchParams();
  const playerId = searchParams.get("playerId");

  const { data: playerData, isLoading: playerLoading } =
    useGetPlayerQuery(user?.email || "");

  const tags = [playerId as string, user?.name].filter(Boolean).join(",");
  const queryString = `?tags=${tags}`;

  const { data: galleriesData, isLoading: galleriesLoading } =
    useGetGalleriesQuery(queryString);

  const isLoading = playerLoading || galleriesLoading;
  const player = playerData?.data;
  const galleries = galleriesData;

  if (isLoading) {
    return (
      <div className="_page">
        <HEADER title="My Galleries" subtitle="Manage your own galleries" />
        <div className="flex justify-center items-center min-h-100">
          <Loader message="Loading galleries..." />
        </div>
      </div>
    );
  }

  if (!player || !galleries) {
    return (
      <div className="_page">
        <HEADER title="My Galleries" subtitle="Manage your own galleries" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load galleries. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="_page">
      <HEADER title="My Galleries" subtitle="Manage your own galleries" />
      <PlayerGalleriesClient player={player} galleries={galleries} />
    </div>
  );
};

export default PlayerGalleries;
