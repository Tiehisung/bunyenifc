 

import { PrimaryDropdown } from "@/components/Dropdown";
import LightboxViewer from "@/components/viewer/LightBox";
import { shortText } from "@/lib";
import { downloadFile, getVideoThumbnail } from "@/lib/file";
import { formatDate } from "@/lib/timeAndDate";
import { IGallery } from "@/types/file.interface";
import { Download, Trash, View } from "lucide-react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ConfirmActionButton } from "@/components/buttons/ConfirmAction";
import IMAGE from "@/components/Image";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useDeleteGalleryMutation } from "@/services/gallery.endpoints";

type GalleryProps = {
  gallery: IGallery;
  className?: string;
};

export function GalleryCard({ gallery, className = "" }: GalleryProps) {
  const [open, setOpen] = useState(false);

  // Prepare slides for lightbox
  const files = useMemo(
    () =>
      gallery?.files
        ?.filter(
          (f) => f.resource_type == "image" || f.resource_type == "video"
        )
        ?.map((file) => ({
          src: file.secure_url,
          width: file.width ?? 1600,
          height: file.height ?? 900,
          title: shortText(
            file?.original_filename ?? file?.name ?? "Image",
            20
          ),
          description: file.description,
          type: file.resource_type as "image" | "video",
        })),
    [gallery]
  );

  const thumbnailFile =
    gallery?.files?.find((f) => f.resource_type == "image") ??
    gallery?.files?.[0];

  const thumbnail_url =
    thumbnailFile?.resource_type == "video"
      ? getVideoThumbnail(thumbnailFile.public_id)
      : thumbnailFile.secure_url;

      const [deleteGallery, { isLoading:deletingGallery }] = useDeleteGalleryMutation();

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
        }}
        className={`relative overflow-hidden rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-primary w-full h-auto ${className}`}
        aria-label={thumbnailFile?.original_filename ?? `Open image`}
        type="button"
      >
        <motion.div
          key={gallery._id}
          className="relative rounded-xl overflow-hidden shadow-sm group bg-card hover:shadow-lg transition-all"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
        >
          {/* Cover Image */}
          {thumbnail_url && (
            <div className="relative w-full aspect-4/3">
              <IMAGE
                src={thumbnail_url}
                fallbackSrc={thumbnailFile?.thumbnail_url as string}
                alt={
                  gallery.title ||
                  thumbnailFile?.original_filename ||
                  "Gallery image"
                }
                fill
                className="object-cover"
              />
            </div>
          )}
          {/* Info */}
          <div className="p-4 space-y-1">
            <h3 className=" text-sm flex items-center gap-4 justify-between text-nowrap">
              <span className="font-semibold line-clamp-1 grow">
                {gallery.title || "Untitled"}
              </span>
              <span className="font-light ml-auto">
                {formatDate(gallery?.createdAt, "March 2, 2025")}
              </span>
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {gallery.description || "No description"}
            </p>
          </div>
          {/* Dropdown Menu */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-2 right-2 "
          >
            <PrimaryDropdown className="h-fit ">
              <DropdownMenuItem
                onClick={() =>
                  downloadFile(
                    gallery.files?.[0]?.secure_url || "",
                    gallery.files?.[0]?.original_filename as string,
                  )
                }
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  gallery.files?.forEach((f) =>
                    downloadFile(
                      f?.secure_url || "",
                      f?.original_filename as string,
                    ),
                  );
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Gallery
              </DropdownMenuItem>

              <DropdownMenuItem>
                <View className="w-4 h-4 mr-2" />
                View Gallery
              </DropdownMenuItem>

              <ConfirmActionButton
                trigger={
                  <>
                    <Trash className="w-4 h-4 mr-2" /> Delete
                  </>
                }
                onConfirm={async () => {
                  if (!gallery?._id) return;
                  await deleteGallery(gallery._id);
                }}
                isLoading={deletingGallery}
                confirmText="Delete Gallery?"
                className="h-fit"
                variant="destructive"
                triggerStyles="grow w-full ring justify-start "
              />
            </PrimaryDropdown>
          </div>
        </motion.div>
      </button>

      {/* Lightbox */}
      <LightboxViewer
        open={open}
        onClose={() => setOpen(false)}
        files={files ?? []}
        index={0}
      />
    </>
  );
}
