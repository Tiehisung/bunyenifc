import { ResponsiveSwiper } from "@/components/carousel/ResponsiveSwiper";
import { TITLE } from "@/components/Element";
import { GiDarkSquad } from "react-icons/gi";
import { Badge } from "@/components/ui/badge";
import { useGetSquadsQuery } from "@/services/squad.endpoints";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SlideImage } from "@/components/Image";

const LandingSquad = () => {
  const { data: squadsData, isLoading, error } = useGetSquadsQuery('');

  const squads = squadsData;
  const squad = squads?.data ? squads.data[0] : null;

  if (isLoading) {
    return (
      <div className="py-12 px-4 space-y-8 _page flex justify-center items-center min-h-100">
        <Loader message="Loading squad..." />
      </div>
    );
  }

  if (error || !squad) {
    return (
      <div className="py-12 px-4 space-y-8 _page">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Squad Available</AlertTitle>
          <AlertDescription>
            There is no squad information available at the moment.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 space-y-8 _page">
      <TITLE text={`SQUAD | ${squad?.title}`} icon={<GiDarkSquad />} />

      <ResponsiveSwiper
        swiperStyles={{ width: "100%" }}
        slideStyles={{ backgroundColor: "transparent" }}
        countPerView={{ sm: 2, md: 3, lg: 4, xl: 6 }}
        slides={
          squad?.players?.map((p) => (
            <div key={p?.name} className="relative">
              <SlideImage
                file={{ secure_url: p?.avatar, name: p?.name }}
                caption={p?.name}
                className="rounded-2xl h-48 w-48 object-cover"
              />
              <Badge className="absolute top-3 right-3 uppercase text-xs">
                {p?.position}
              </Badge>
            </div>
          )) ?? []
        }
      />
    </div>
  );
};

export default LandingSquad;
