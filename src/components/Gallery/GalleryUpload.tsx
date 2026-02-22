import { useState, FormEvent, useCallback, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/buttons/Button";
import CloudinaryUploader from "@/components/cloudinary/FileUploadWidget";
import { Input } from "@/components/input/Inputs";
import { apiConfig } from "@/lib/configs";
import { IQueryResponse } from "@/types";
import { IGallery } from "@/types/file.interface";
import { IPlayer } from "@/types/player.interface";
import MultiSelectionInput from "../select/MultiSelect";
import { ICldFileUploadResult } from "@/types/file.interface";
import { getErrorMessage } from "@/lib/error";

interface GalleryUploadProps {
  tags?: string[];
  players?: IPlayer[];
  trigger?: ReactNode;
}

export function GalleryUpload({
  tags = [],
  players = [],
  trigger = <span className="_primaryBtn">Create Gallery</span>,
}: GalleryUploadProps) {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<ICldFileUploadResult[]>([]);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [taggedPlayers, setTaggedPlayers] = useState<string[]>([]);
  const [clearTrigger, setClearTrigger] = useState(0);

  /** Reset form state */
  const resetForm = useCallback(() => {
    setDescription("");
    setTitle("");
    setFiles([]);
    setTaggedPlayers([]);
    setClearTrigger((n) => n + 1);
  }, []);

  /** Handle gallery save */
  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error("Please upload at least one file.");
      return;
    }

    try {
      setIsLoading(true);

      const payload: IGallery = {
        title,
        description,
        files: files.map((file) => ({
          ...file,
          tags: [...tags].filter(Boolean),
        })),
        tags: [
          ...tags,
          ...taggedPlayers.map((t) => t.split(",").flat()).flat(),
        ].filter(Boolean),
        type: "general",
      };

      const response = await fetch(apiConfig.galleries, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
        body: JSON.stringify(payload),
      });

      const result: IQueryResponse = await response.json();
      if (result.success) {
        toast.success(result.message || "Gallery saved successfully!");
        resetForm();
        // Use navigate with state to trigger refresh
        navigate(0); // This refreshes the current route
      } else {
        toast.error(result.message || "Failed to save gallery");
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Something went wrong"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full border border-border rounded-xl bg-card/30 shadow-sm space-y-8 p-4 mb-4">
        <CloudinaryUploader
          setUploadedFiles={setFiles}
          successMessage="Gallery updated"
          clearTrigger={clearTrigger}
          maxFiles={16}
          trigger={trigger}
        />
        {files.length > 0 && (
          <form
            onSubmit={handleSave}
            className="flex flex-col gap-6 md:gap-8 max-w-2xl mx-auto"
          >
            <p className="text-sm text-muted-foreground text-center">
              {files.length} file{files.length !== 1 ? "s" : ""} selected
            </p>

            <div className="flex flex-col gap-4">
              <Input
                onChange={(e) => setTitle(e.target.value)}
                name="title"
                value={title}
                placeholder="Gallery title"
              />
              <Input
                onChange={(e) => setDescription(e.target.value)}
                name="description"
                value={description}
                placeholder="Description"
              />
            </div>

            {players?.length > 0 && (
              <div className="w-full">
                <p className="_label mb-2">Tag Players</p>
                <MultiSelectionInput
                  onChange={(ts) => setTaggedPlayers(ts.map((t) => t.value))}
                  options={players?.map((p) => ({
                    label: `${p.lastName} ${p.firstName}`,
                    value: `${p._id},${p.lastName} ${p.firstName}`,
                  }))}
                  className="text-sm"
                  label=""
                  name={"tags"}
                />
              </div>
            )}

            <div className="flex justify-center">
              <Button
                type="submit"
                waiting={isLoading}
                waitingText="Saving..."
                primaryText="Save Gallery"
                className="_primaryBtn w-48 h-10 justify-center"
              />
            </div>
          </form>
        )}
      </div>
    </>
  );
}
