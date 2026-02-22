import { useEffect, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import CloudinaryUploader from "@/components/cloudinary/FileUploadWidget";
import { Input } from "@/components/input/Inputs";
import { Button } from "@/components/buttons/Button";
import { PrimarySelect } from "@/components/select/Select";
import MultiSelectionInput from "@/components/select/MultiSelect";
import { PrimaryCollapsible } from "@/components/Collapsible";
import { DIALOG } from "@/components/Dialog";
import { formatDate } from "@/lib/timeAndDate";
import { symbols } from "@/data";
import { useFetch } from "@/hooks/fetch";
import { apiConfig } from "@/lib/configs";

import { IMatch, IMatchHighlight } from "@/types/match.interface";
import { IPlayer } from "@/types/player.interface";
import { ICldFileUploadResult } from "@/types/file.interface";
import { IQueryResponse } from "@/types";
import { toggleClick } from "@/lib/dom";
import { getErrorMessage } from "@/lib/error";

interface GalleryUploadProps {
  trigger?: ReactNode;
  matches?: IMatch[];
}

/* ----------------------------------
   ZOD SCHEMA
----------------------------------- */

const highlightSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  match: z.string().min(1, "Match is required"),
  tags: z.array(z.string()).optional(),
});

type HighlightForm = z.infer<typeof highlightSchema>;

/* ----------------------------------
   COMPONENT
----------------------------------- */

export function HighlightUpload({
  trigger = <span className="_primaryBtn">Upload Highlight</span>,
  matches,
}: GalleryUploadProps) {
  const navigate = useNavigate();
  const [file, setFile] = useState<ICldFileUploadResult | null>(null);
  const [clearTrigger, setClearTrigger] = useState(0);

  const { results, loading: fetchingPlayers } = useFetch<IPlayer[]>({
    uri: "/players",
  });

  const players = results?.data ?? [];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HighlightForm>({
    resolver: zodResolver(highlightSchema),
    defaultValues: {
      title: matches?.[0]?.title ?? "",
      description: "",
      match: matches?.[0]?._id ?? "",
      tags: [],
    },
  });

  /* Sync filename → title */
  useEffect(() => {
    if (file?.original_filename) {
      reset((prev) => ({
        ...prev,
        title: file.original_filename as string,
      }));
    }
  }, [file, reset]);

  // Auto-open dialog when video uploaded
  useEffect(() => {
    if (file) toggleClick("upload-dialog");
  }, [file]);

  // Submit
  const onSubmit = async (data: HighlightForm) => {
    if (!file) {
      toast.error("Please upload a video");
      return;
    }

    try {
      const payload: IMatchHighlight = {
        ...file,
        ...data,
        match: matches?.find((m) => m._id == data.match) as IMatch,
        tags: [
          ...(data.tags || []),
          matches?.find((m) => m._id == data?.match)?.title ?? "",
        ].filter(Boolean),
      };

      const res = await fetch(apiConfig.highlights, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result: IQueryResponse = await res.json();

      if (result.success) {
        toast.success("Highlight saved");
        reset();
        setFile(null);
        setClearTrigger((n) => n + 1);
        navigate(0);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="w-full border border-border rounded-xl bg-card/30 shadow-sm space-y-8 p-4 mb-4">
      <CloudinaryUploader
        setUploadedFiles={(f) => setFile(f?.[0])}
        clearTrigger={clearTrigger}
        maxFiles={1}
        trigger={trigger}
        resourceType="video"
        folder="match-highlights"
        multiple={false}
        hidePreview
        maxFileSize="100_000_000"
      />

      {file && (
        <DIALOG trigger={undefined} id="upload-dialog" title="SAVE HIGHLIGHT">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 max-w-2xl mx-auto px-1"
          >
            {/* Title */}
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <Input {...field} label="Title" error={errors.title?.message} />
              )}
            />

            {/* Description */}
            <Controller
              control={control}
              name="description"
              render={({ field }) => <Input {...field} label="Description" />}
            />

            {/* Match */}
            <Controller
              control={control}
              name="match"
              render={({ field }) => (
                <PrimarySelect
                  label="Match"
                  triggerStyles="w-full"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.match?.message}
                  options={
                    matches
                      ?.filter((m) => m.status !== "UPCOMING")
                      .map((m) => ({
                        label: m.title + symbols.longDash + formatDate(m.date),
                        value: m._id,
                      })) ?? []
                  }
                />
              )}
            />

            {/* Tags */}
            {players.length > 0 && (
              <PrimaryCollapsible
                header={{ icon: "#", label: "Tag Players" }}
                loading={fetchingPlayers}
              >
                <Controller
                  control={control}
                  name="tags"
                  render={({ field }) => (
                    <MultiSelectionInput
                      {...field}
                      initialOptions={field.value}
                      onChange={(items) =>
                        field.onChange(items.map((t) => t.value))
                      }
                      options={players.map((p) => ({
                        label: `${p.firstName} ${p.lastName}`,
                        value: `${p._id} ${p.firstName} ${p.lastName}`,
                      }))}
                    />
                  )}
                />
              </PrimaryCollapsible>
            )}

            <Button
              type="submit"
              waiting={isSubmitting}
              primaryText="SAVE HIGHLIGHT"
            />

            <video
              src={file.secure_url}
              controls
              className="rounded-lg mt-6 max-h-80 w-full"
            />
          </form>
        </DIALOG>
      )}
    </div>
  );
}
