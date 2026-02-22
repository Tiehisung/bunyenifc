import { motion } from "framer-motion";
import { Download, Trash, View } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { IGallery } from "@/types/file.interface";
import { PrimaryDropdown } from "@/components/Dropdown";
import { downloadFile } from "@/lib/file";
import { ConfirmActionButton } from "@/components/buttons/ConfirmAction";
import { useState } from "react";
import { formatDate } from "@/lib/timeAndDate";
import LightboxViewer from "@/components/viewer/LightBox";

import Loader from "@/components/loaders/Loader";
import {
  useDeleteGalleryMutation,
  useGetGalleriesQuery,
} from "@/services/gallery.endpoints";
import { dummyUser } from "@/data/user";

interface GalleryDisplayProps {
  galleries?: IGallery[]; // Make optional since we might fetch internally
}

export function GalleryDisplay({
  galleries: propGalleries,
}: GalleryDisplayProps) {
  const [selectedGallery, setSelectedGallery] = useState<IGallery | undefined>(
    undefined,
  );
  const user = dummyUser; // Replace useSession with your auth context
  const [isOpen, setIsOpen] = useState(false);

  // Fetch galleries if not provided via props
  const { data: fetchedGalleries, isLoading } = useGetGalleriesQuery(
    undefined,
    {
      skip: !!propGalleries, // Skip if galleries provided via props
    },
  );

  // Use props if provided, otherwise use fetched data
  const galleries = propGalleries || fetchedGalleries?.data;

  const [deleteGallery] = useDeleteGalleryMutation();

  const isAdmin = user?.role?.includes("admin");

  const handleDelete = async (galleryId: string) => {
    try {
      await deleteGallery(galleryId).unwrap();
    } catch (error) {
      console.error("Failed to delete gallery:", error);
    }
  };

  const openLightbox = (gallery: IGallery) => {
    setSelectedGallery(gallery);
    setIsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-50">
        <Loader message="Loading galleries..." />
      </div>
    );
  }

  if (!galleries?.length) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No galleries uploaded yet.
      </p>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {galleries.map((gallery) => (
          <GalleryCard
            gallery={gallery}
            key={gallery._id}
            onView={() => openLightbox(gallery)}
            isAdmin={isAdmin}
            onDelete={() => handleDelete(gallery?._id as string)}
          />
        ))}
      </div>

      <LightboxViewer
        open={isOpen}
        onClose={() => setIsOpen(false)}
        files={
          selectedGallery?.files
            ?.filter((f) => f?.resource_type === "image" || f?.type === "video")
            ?.map((f) => ({
              src: f.secure_url,
              alt: f.original_filename,
              height: f.height,
              width: f.width,
              type: f.resource_type as "image" | "video",
            })) ?? []
        }
        index={0}
      />
    </>
  );
}

// Updated GalleryCard component to accept handlers
interface GalleryCardProps {
  gallery: IGallery;
  onView: () => void;
  isAdmin?: boolean;
  onDelete: () => Promise<void>;
}

export function GalleryCard({
  gallery,
  onView,
  isAdmin,
  onDelete,
}: GalleryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-video">
        <img
          src={gallery.files[0]?.secure_url || "/placeholder-image.jpg"}
          alt={gallery.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />

        {/* Admin dropdown menu */}
        {isAdmin && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <PrimaryDropdown trigger={<View className="w-4 h-4" />}>
              <DropdownMenuItem onClick={onView}>
                <View className="w-4 h-4 mr-2" /> View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  downloadFile(
                    gallery.files[0]?.secure_url,
                    gallery.files[0]?.original_filename as string,
                  )
                }
              >
                <Download className="w-4 h-4 mr-2" /> Download
              </DropdownMenuItem>
              <ConfirmActionButton
                onConfirm={onDelete}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash className="w-4 h-4 mr-2" /> Delete
                  </DropdownMenuItem>
                }
                title="Delete Gallery"
                confirmText="Are you sure you want to delete this gallery?"
                variant="destructive"
              />
            </PrimaryDropdown>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">
          {gallery.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {gallery.description}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{gallery.files.length} items</span>
          <span>{formatDate(gallery.createdAt, "dd/mm/yyyy")}</span>
        </div>
        {(gallery?.tags?.length||0) > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {gallery?.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-secondary rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
            {(gallery?.tags?.length||0) > 3 && (
              <span className="px-2 py-0.5 text-xs text-muted-foreground">
                +{(gallery?.tags?.length||0) - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
