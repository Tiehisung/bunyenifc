import MasonryGallery from "@/components/Gallery/Masonry";
import { IPlayer } from "@/types/player.interface";
import CloudinaryUploader from "@/components/cloudinary/FileUploadWidget";
import { useState } from "react";
import { ICldFileUploadResult } from "@/types/file.interface";
import { useUpdatePlayerMutation } from "@/services/player.endpoints";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/buttons/Button";

export function PlayerFeatureMedia({ player }: { player?: IPlayer }) {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<ICldFileUploadResult | null>(
    null,
  );
  const [updatePlayer, { isLoading }] = useUpdatePlayerMutation();

  const handleSaveMedia = async () => {
    if (!uploadedFile || !player?._id) return;

    try {
      const result = await updatePlayer({
        _id: player._id,
        featureMedia: [uploadedFile, ...(player?.featureMedia ?? [])].filter(
          Boolean,
        ),
      }).unwrap();

      if (result.success) {
        toast.success("Media saved successfully");
        setUploadedFile(null);
        navigate(0);
      }
    } catch (error) {
      toast.error("Failed to save media");
    }
  };

  const handleSetWallpaper = async (file: ICldFileUploadResult) => {
    if (!player?._id) return;

    try {
      const result = await updatePlayer({
        _id: player._id,
        featureMedia: [
          file,
          ...(player?.featureMedia?.filter(
            (m) => m.public_id !== file.public_id,
          ) ?? []),
        ],
      }).unwrap();

      if (result.success) {
        toast.success("Wallpaper updated");
        navigate(0);
      }
    } catch (error) {
      toast.error("Failed to update wallpaper");
    }
  };

  const handleDeleteMedia = async (file: ICldFileUploadResult) => {
    if (!player?._id) return;

    try {
      const result = await updatePlayer({
        _id: player._id,
        featureMedia:
          player?.featureMedia?.filter((m) => m.public_id !== file.public_id) ??
          [],
      }).unwrap();

      if (result.success) {
        toast.success("Media deleted");
        navigate(0);
      }
    } catch (error) {
      toast.error("Failed to delete media");
    }
  };

  return (
    <div className="p-6 grow min-h-44 my-10 w-full">
      <h3 className="text-lg font-semibold mb-4">Featured Media</h3>
      <div className="flex flex-col items-center justify-center gap-6 my-6 border-t pt-3">
        <CloudinaryUploader
          triggerId="feature-image"
          setUploadedFiles={(fs) => setUploadedFile(fs?.[0])}
          maxFiles={1}
          multiple={false}
          trigger={
            <span className="_secondaryBtn ring">Add Feature Media</span>
          }
          clearTrigger={player?.featureMedia?.length as number}
        />

        {uploadedFile && (
          <Button
            onClick={handleSaveMedia}
            primaryText="SAVE MEDIA"
            waitingText="SAVING..."
            className="w-52 justify-center"
            disabled={isLoading}
          />
        )}
      </div>

      {player?.featureMedia?.length ? (
        <MasonryGallery
          files={player?.featureMedia ?? []}
          useSize
          action={(f) => (
            <div className="space-y-1.5">
              <Button
                onClick={() => handleSetWallpaper(f)}
                primaryText="Set as Wallpaper"
                waitingText="Finalizing..."
                variant="secondary"
                className="w-full _hover"
                disabled={isLoading}
              />
              <Button
                onClick={() => handleDeleteMedia(f)}
                primaryText="Delete"
                waitingText="Wait..."
                variant="secondary"
                className="w-full _hover"
                disabled={isLoading}
              />
            </div>
          )}
        />
      ) : null}
    </div>
  );
}
