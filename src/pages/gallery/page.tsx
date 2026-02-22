import GalleryClient from "./Client";
import InfiniteLimitScroller from "@/components/InfiniteScroll";
import { IntroSection } from "@/components/IntroSection";
import { staticImages } from "@/assets/images";
import { GrGallery } from "react-icons/gr";
import { GalleryUpload } from "@/components/Gallery/GalleryUpload";
import { useSearchParams } from "react-router-dom";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { dummyUser } from "@/data/user";
import { useGetGalleriesQuery } from "@/services/gallery.endpoints";
import { useGetPlayersQuery } from "@/services/player.endpoints";

const GalleryPage = () => {
  const [searchParams] = useSearchParams();
  const paramsString = searchParams.toString();
  const user = dummyUser;

  const {
    data: galleries,
    isLoading: galleriesLoading,
    error: galleriesError,
  } = useGetGalleriesQuery(paramsString);

  const { data: players, isLoading: playersLoading } = useGetPlayersQuery("");

  const isLoading = galleriesLoading || playersLoading;
  const isAdmin = user?.role?.includes("admin");

  const featureImage =
    galleries?.data?.[0]?.files?.find((f) => f.resource_type === "image")
      ?.secure_url ?? staticImages.ballOnGrass;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <Loader message="Loading gallery..." />
      </div>
    );
  }

  if (galleriesError) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load gallery:{" "}
            {(galleriesError as any)?.message || "Unknown error"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <IntroSection
        image={featureImage}
        title="Gallery"
        subtitle="Capture and relive your best moments"
        icon={<GrGallery />}
        className="rounded-b-2xl py-6"
      >
        <br />
        {isAdmin && <GalleryUpload players={players?.data} />}
      </IntroSection>
      <GalleryClient galleries={galleries} />
      <InfiniteLimitScroller pagination={galleries?.pagination} />
    </div>
  );
};

export default GalleryPage;
