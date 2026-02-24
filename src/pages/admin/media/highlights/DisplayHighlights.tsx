import { icons } from "@/assets/icons/icons";
import { Button } from "@/components/buttons/Button";
import { ConfirmActionButton } from "@/components/buttons/ConfirmAction";
import { POPOVER } from "@/components/ui/popover";
import LightboxViewer from "@/components/viewer/LightBox";
import { downloadFile } from "@/lib/file";
import { getVideoThumbnail } from "@/lib/file";
import { IQueryResponse } from "@/types";
import { IMatchHighlight } from "@/types/match.interface";
import { Download, Play } from "lucide-react";
import { useState } from "react";

// Dummy user
import { dummyUser } from "@/data/user";
import {
  useGetHighlightsQuery,
  useDeleteHighlightMutation,
} from "@/services/highlights.endpoints";
import { smartToast } from "@/utils/toast";

interface Props {
  highlights?: IQueryResponse<IMatchHighlight[]>;
  matchId?: string; // Optional: to fetch highlights for specific match
}

export const MatchHighlights = ({
  highlights: propHighlights,
  matchId,
}: Props) => {
  const [activeVideo, setActiveVideo] = useState<IMatchHighlight | null>(null);

  // Fetch highlights if not provided via props
  const { data: fetchedHighlights, isLoading } = useGetHighlightsQuery(
    matchId ? `?matchId=${matchId}` : undefined,
    { skip: !!propHighlights },
  );

  const highlights = propHighlights || fetchedHighlights;

  if (isLoading) {
    return (
      <div className="text-center text-gray-500 py-10">
        Loading highlights...
      </div>
    );
  }

  if (!((highlights?.data?.length ?? 0) > 0)) {
    return (
      <div className="text-center text-gray-500 py-10">
        No match highlights yet.
      </div>
    );
  }

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
        {highlights?.data?.map((video) => (
          <div
            key={video?._id}
            onClick={() => setActiveVideo(video)}
            className="group relative cursor-pointer rounded-xl overflow-hidden bg-modalOverlay shadow-lg transition"
          >
            <img
              src={
                getVideoThumbnail(video?.public_id, { second: 4 }) ||
                (video?.thumbnail_url as string)
              }
              alt={video?.title}
              className="w-full h-60 object-cover opacity-80 group-hover:scale-[1.01] group-hover:opacity-60 transition"
            />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-Orange/20 p-4 rounded-full">
                <Play className="w-8 h-8 text-Red" />
              </div>
            </div>

            {/* Title */}
            <div className="absolute bottom-0 w-full p-3 bg-linear-to-t from-black/80 to-transparent">
              <p className="text-white font-normal text-sm truncate">
                {video?.title}
              </p>
            </div>

            <HighlightMediaActions highlight={video} />
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <LightboxViewer
          open={true}
          onClose={() => setActiveVideo(null)}
          files={[
            activeVideo,
            ...(highlights?.data?.filter((h) => h._id !== activeVideo?._id) ??
              []),
          ]?.map((v) => ({
            type: "video",
            src: v.secure_url,
            width: v.width,
            height: v.height,
            alt: v.name ?? v.original_filename,
          }))}
          index={0}
        />
      )}
    </>
  );
};

export const HighlightMediaActions = ({
  highlight,
}: {
  highlight?: IMatchHighlight;
}) => {
  const [deleteHighlight, { isLoading }] = useDeleteHighlightMutation();

  // Use dummy user instead of session
  const user = dummyUser;
  const isAdmin = user?.role?.includes("admin");

  if (!isAdmin) return null;

  const handleDelete = async () => {
    if (!highlight?._id) return;
    try {
      const result = await deleteHighlight(highlight._id).unwrap();
      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
    >
      <POPOVER
        variant="secondary"
        className="h-fit"
        triggerClassNames="rounded-full w-7 h-7"
      >
        <Button
          onClick={() =>
            downloadFile(
              highlight?.secure_url || "",
              highlight?.original_filename as string,
            )
          }
          className="flex items-center gap-1 _hover p-1.5 px-3.5 w-full justify-start"
          variant="ghost"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>

        <ConfirmActionButton
          title={`Delete - ${highlight?.title}`}
          primaryText="Delete"
          confirmText="Do you want to delete this highlight?"
          onConfirm={handleDelete}
          className="h-fit w-full"
          variant="destructive"
          confirmVariant="delete"
          loadingText="Deleting..."
          isLoading={isLoading}
          trigger={
            <>
              <icons.trash /> Delete
            </>
          }
          triggerStyles="px-6 w-full justify-start"
          escapeOnEnd
        />
      </POPOVER>
    </div>
  );
};
