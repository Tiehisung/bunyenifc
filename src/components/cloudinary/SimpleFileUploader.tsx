
import { staticImages } from "@/assets/images";
 
import { apiConfig } from "@/lib/configs";
import { EPreset, EPresetType, IQueryResponse } from "@/types";
 
import React, { ReactNode, useState } from "react";
import { FcCamera } from "react-icons/fc";
import { toast } from "sonner";
import { OverlayLoader } from "../loaders/OverlayLoader";
import { ICldFileUploadResult } from "@/types/file.interface";
import { bytesToMB, shortText } from "@/lib";
import { getErrorMessage } from "@/lib/error";
import { getFilePath } from "@/lib/file";

interface FileUploaderProps {
  initialFileUrl?: string;
  exportFileData: (data: ICldFileUploadResult) => void;
  className?: string;
  name: string;
  titleStyles?: string;
  folder?: string;
  trigger?: ReactNode;
  showName?: boolean;
  fileStyles?: string;
  maxSize?: number;
  accept?: "image" | "video" | "pdf" | "auto";
  hidePreview?: boolean;
}

const FileUploader = ({
  initialFileUrl,
  exportFileData,
  className,
  name,
  maxSize = 3524000,
  folder,
  trigger = <FcCamera size={30} />,
  showName,
  fileStyles,
  accept = "image",
  hidePreview = false,
}: FileUploaderProps) => {
  const [waiting, setWaiting] = useState(false);

  const [uploadedFile, setUploadedFile] = useState<ICldFileUploadResult | null>(
    null
  );
  console.log({ uploadedFile });
  const currentSrc =
    uploadedFile?.thumbnail_url || initialFileUrl || staticImages.avatar;

  async function handleFileSelection(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    try {
      setWaiting(true);
      const selectedFile = event.target.files ? event.target.files[0] : null;
      if (!selectedFile) return;
      if (selectedFile.size > maxSize) {
        toast.error(` File should not exceed ${bytesToMB(maxSize)}`);
        return;
      }

      const fileString = await getFilePath(selectedFile);

      //Now Upload
      if (fileString) {
        const upload = await fetch(apiConfig.fileUpload, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: selectedFile.name,
            path: fileString,
            type: "image",
            preset: EPreset.KFC_SIGNED,
            folder: folder ?? "files",
            presetType: EPresetType.AUTHENTICATED,
          }),
        });
        const uploadRsp: IQueryResponse<ICldFileUploadResult> =
          await upload.json();

        if (!uploadRsp.success) {
          toast.error(uploadRsp.message, { position: "bottom-center" });
          setUploadedFile(null);
          return;
        }
        setUploadedFile(uploadRsp.data as ICldFileUploadResult);
        exportFileData(uploadRsp.data as ICldFileUploadResult);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setWaiting(false);
    }
  }
  return (
    <div
      className={`relative grid gap-1 justify-center items-center text-sm ${className}`}
    >
      <OverlayLoader isLoading={waiting} />
      {!hidePreview && (
        <img
          src={currentSrc}
          width={300}
          height={300}
          alt="desc image"
          className={`h-36 w-36 rounded-xl ${fileStyles}`}
        />
      )}

      {showName && (
        <span className="text-sm line-clamp-1">
          {shortText(uploadedFile?.original_filename ?? "")}
        </span>
      )}
      <label
        htmlFor={`id${name}`}
        className="flex items-center rounded mt-3 cursor-pointer min-w-full grow "
        title="Choose file"
        aria-disabled={waiting}
      >
        {trigger}
        <input
          id={`id${name}`}
          hidden
          type="file"
          onChange={handleFileSelection}
          name="image"
          className=""
          accept={
            accept === "image"
              ? "image/*"
              : accept === "pdf"
              ? "application/pdf"
              : accept === "video"
              ? "video/*"
              : "*/*"
          }
          disabled={waiting}
        />
      </label>
    </div>
  );
};

export default FileUploader;
