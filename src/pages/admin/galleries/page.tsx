import { GalleryUpload } from "@/components/Gallery/GalleryUpload";
import { StackModal } from "@/components/modals/StackModal";
import { GalleryDisplay } from "./Display";
import { SearchGallery } from "./Search";
import InfiniteLimitScroller from "@/components/InfiniteScroll";
import { useSearchParams } from "react-router-dom";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGetGalleriesQuery } from "@/services/gallery.endpoints";
import { useGetPlayersQuery } from "@/services/player.endpoints";

export default function GalleriesAdmin() {
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString()
    ? `?${searchParams.toString()}`
    : "";

  // Fetch galleries with query params
  const {
    data: galleries,
    isLoading: galleriesLoading,
    error: galleriesError,
    isFetching,
  } = useGetGalleriesQuery(queryString);

  // Fetch players for tagging
  const { data: players, isLoading: playersLoading } = useGetPlayersQuery('');

  const isLoading = galleriesLoading || playersLoading;
  const hasError = galleriesError;

  if (isLoading) {
    return (
      <div className="pt-16 _page flex justify-center items-center min-h-100">
        <Loader message="Loading galleries..." />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="pt-16 _page">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load galleries:{" "}
            {(galleriesError as any)?.message || "Unknown error"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="pt-16 _page">
      <StackModal
        id="new-gallery"
        trigger="Create Gallery"
        variant="default"
        className="p-4"
      >
        <GalleryUpload players={players?.data} />
      </StackModal>

      <br />

      <SearchGallery players={players?.data} />

      <GalleryDisplay galleries={galleries?.data ?? []} />

      <InfiniteLimitScroller
        pagination={galleries?.pagination}
        endDataText="No more galleries"
      />

      {isFetching && (
        <div className="fixed bottom-4 right-4">
          <Loader size="sm" message="Updating..." />
        </div>
      )}
    </div>
  );
}
