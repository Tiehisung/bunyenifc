import FileUploader from "@/components/cloudinary/SimpleFileUploader";
import { PrimaryCollapsible } from "@/components/Collapsible";
import { DIALOG } from "@/components/Dialog";
import { apiConfig } from "@/lib/configs";
import { Upload } from "lucide-react";
import { ReactNode, useState, FormEvent } from "react";
import { FaFilePdf } from "react-icons/fa";

import MultiSelectionInput from "@/components/select/MultiSelect";
import { IQueryResponse, ISelectOptionLV } from "@/types";
import { FancyMotion } from "@/components/Animate/MotionWrapper";
import { COMBOBOX } from "@/components/ComboBox";
import { PiFolderPlusLight } from "react-icons/pi";
import { toast } from "sonner";

import { Button } from "@/components/buttons/Button";
import { fireDoubleEscape } from "@/hooks/Esc";
import { useFetch } from "@/hooks/fetch";
import { Separator } from "@/components/ui/separator";
import { IFolderMetrics } from "@/types/doc";
import { ICldFileUploadResult } from "@/types/file.interface";
import { getErrorMessage } from "@/lib/error";
import { useNavigate } from "react-router-dom";

interface IProps {
  defaultFolder?: string;
  tagsData?: {
    name: string;
    options: ISelectOptionLV[];
  }[];
  trigger?: ReactNode;
  className?: string;
  folders?: { name: string; _id: string }[];
}

export function DocumentUploader({
  defaultFolder = "",
  tagsData = [],
}: IProps) {
  const navigate = useNavigate(); // Changed from useRouter
  const [waiting, setWaiting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<ICldFileUploadResult | null>(
    null,
  );

  const [tags, setTags] = useState<Record<string, string[]> | object>({});

  const [selectedFolder, setSelectedFolder] = useState(defaultFolder);

  const { loading: fetchingFolders, results: folderMetrics } = useFetch<{
    folders: IFolderMetrics[];
  }>({
    uri: `${apiConfig.docs}/metrics`,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setWaiting(true);
      const response = await fetch(apiConfig.docs, {
        method: "POST",
        body: JSON.stringify({
          file: uploadedFile,
          tags: Object.values(tags).flat(1).filter(Boolean),
          format: "pdf",
          folder: selectedFolder,
        }),
        headers: { "content-type": "application/json" },
      });

      const result: IQueryResponse = await response.json();
      if (result.success) {
        setUploadedFile(null);
        toast.success(result.message);
        navigate(0); // Changed from router.refresh() to soft refresh
        fireDoubleEscape();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setWaiting(false);
    }
  };

  return (
    <DIALOG
      trigger={
        <>
          <Upload size={24} /> Upload Document
        </>
      }
      triggerStyles="justify-start"
      className="min-w-57.5"
      title="Upload Document"
      variant={"outline"}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 items-center justify-center _card rounded-xl mx-auto"
      >
        <div className="flex flex-col gap-4 items-center justify-center grow w-full pb-3">
          <FileUploader
            hidePreview
            trigger={
              <div className="_secondaryBtn grow w-full">Choose Document</div>
            }
            name="consentForm"
            accept="pdf"
            exportFileData={(file) => {
              setUploadedFile(file);
            }}
            maxSize={10524000}
          />

          {uploadedFile && (
            <div className="flex flex-col justify-center items-center">
              <FaFilePdf className="text-Red" size={40} />
              <p className="line-clamp-2 wrap-break-word">
                {uploadedFile?.name ?? uploadedFile?.original_filename}
              </p>
            </div>
          )}
        </div>

        <Separator />

        {tagsData?.map((tagGroup, tIndex) => {
          return (
            <PrimaryCollapsible
              header={{
                label: tagGroup?.name,
                className: "_label",
              }}
              key={tIndex}
            >
              <MultiSelectionInput
                onChange={(ts) => {
                  setTags((prev) => ({
                    ...prev,
                    [tagGroup.name]: ts.map((t) => t.value),
                  }));
                }}
                options={tagGroup?.options}
                className="text-sm"
                label={tagGroup?.name}
                name={tagGroup?.name}
              />
            </PrimaryCollapsible>
          );
        })}

        {!defaultFolder && (
          <div className="flex items-center gap-2">
            <PiFolderPlusLight
              className="text-primary dark:text-Orange"
              size={30}
            />
            <COMBOBOX
              options={
                folderMetrics?.data?.folders?.map((f) => ({
                  label: f?.name,
                  value: f?.name,
                })) ?? []
              }
              onChange={(op) => setSelectedFolder(op.value)}
              placeholder="Select Folder"
              className="capitalize"
              defaultOptionValue={defaultFolder}
              isLoading={fetchingFolders}
            />
          </div>
        )}
        <br />
        <FancyMotion direction="left" preset="fade" className="w-full">
          <Button
            type="submit"
            primaryText="Save Form"
            waitingText="Saving..."
            className="w-full justify-center max-w-md mx-auto py-3"
            disabled={!uploadedFile || !selectedFolder}
            waiting={waiting}
          />
        </FancyMotion>
      </form>
    </DIALOG>
  );
}

// The tagsData comment remains the same
