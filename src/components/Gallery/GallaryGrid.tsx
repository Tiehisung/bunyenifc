 

import { IGallery } from "@/types/file.interface";
import { SecondaryGalleryCard } from "./GalleryCardSecondary";

interface GalleryGridProps {
  galleries: IGallery[];
  showDate?: boolean;
}

export default function GalleryGrid({
  galleries,
 
}: GalleryGridProps) {
  if (!galleries?.length) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No galleries found.
      </div>
    );
  }

  return (
    <>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 _page"
        id="gallery"
      >
        {galleries?.map((gallery) => (
          <SecondaryGalleryCard key={gallery?._id} gallery={gallery} />
        ))}
      </div>
    </>
  );
}
