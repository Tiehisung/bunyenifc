import PrimLink from "@/components/Link";
import { ResponsiveSwiper } from "@/components/carousel/ResponsiveSwiper";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { generatePlayerAbout } from "@/data/about";
import { TbPlayFootball } from "react-icons/tb";
import { TITLE } from "@/components/Element";
import { useGetPlayersQuery } from "@/services/player.endpoints";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const LandingPlayers = () => {
  const { data: playersData, isLoading, error } = useGetPlayersQuery('');
  const players = playersData;

  if (isLoading) {
    return (
      <div className="_page px-4 flex justify-center items-center min-h-100">
        <Loader message="Loading players..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="_page px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load players. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="_page px-4">
      <TITLE text="Players" icon={<TbPlayFootball />} />
      <br />
      <ResponsiveSwiper
        swiperStyles={{ width: "100%", height: "fit-content" }}
        slideStyles={{ borderRadius: "0" }}
        slides={
          players?.data?.map((player) => (
            <div key={player._id}>
              <img
                src={player?.avatar}
                alt="player"
                className="min-w-full grow object-cover border aspect-video"
              />
              <div className="bg-secondary text-secondary-foreground space-y-2 p-4 pb-8">
                <Badge
                  className="capitalize min-h-6 min-w-10"
                  variant="secondary"
                >
                  {player?.position}
                </Badge>
                <div
                  className="_p line-clamp-4 mb-5 font-semibold"
                  dangerouslySetInnerHTML={{
                    __html: generatePlayerAbout(
                      player?.firstName ?? "",
                      player?.lastName ?? "",
                      player?.position,
                    ),
                  }}
                />

                <br />
                <Link to={`/players/details?playerId=${player?._id}`}>
                  <span className="bg-Red p-2 px-4">DISCOVER</span>
                </Link>
              </div>
            </div>
          )) ?? []
        }
      />

      <PrimLink to="/players" text="See more" className="ml-auto" />
    </div>
  );
};

export default LandingPlayers;
