 

import { MediaPreview } from "@/components/files/MediaView";
import {   IQueryResponse } from "@/types";
import { useState } from "react";
import { MotionWrapper } from "@/components/Animate/MotionWrapper";
import { AnimateOnView } from "@/components/Animate/AnimateOnView";
import CardCarousel from "@/components/carousel/cards";
import { IGallery } from "@/types/file.interface";

export function HomePlayersGallery({
  galleries,
  initialCount = 4,
}: {
  galleries?: IQueryResponse<IGallery []>;
  initialCount?: number;
}) {
  const [limit, setLimit] = useState(initialCount);
 

  return (
    <section className="space-y-3">
      <p className="text-sm text-muted-foreground line-clamp-3">
        Our galleries
      </p>
      {/* Media grid */}
      <div className="flex flex-col sm:grid grid-cols-2 lg:grid-cols-3 gap-3">
        {galleries?.data?.slice(0, limit)?.map((galF, i) => (
          <MotionWrapper key={galF?._id}>
            <AnimateOnView index={i}>
              <CardCarousel
                effect={i % 2 == 0 ? "creative" : i % 3 == 0 ? "cube" : "fade"}
                cards={galF?.files?.map((f) => (
                  <MediaPreview file={f} key={f.secure_url} />
                ))}
                slideClassName=""
                swiperStyles={{ width: "100%" }}
              />
            </AnimateOnView>
          </MotionWrapper>
        ))}

        {(galleries?.data?.length ?? 0) > limit && (
          <div
            onClick={() => setLimit((p) => p + 5)}
            className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-semibold text-muted-foreground"
          >
            +{(galleries?.data?.length ?? 0) - limit} more
          </div>
        )}
      </div>

      {/* Description */}

    </section>
  );
}
