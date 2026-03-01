import { staticImages } from "@/assets/images";

import React, { ReactNode, useState } from "react";
import { FcCamera } from "react-icons/fc";
import { OverlayLoader } from "../loaders/OverlayLoader";
import { ICloudinaryFile } from "@/types/file.interface";
import { bytesToMB, shortText } from "@/lib";
import { useUploadImageMutation } from "@/services/upload.endpoints";
import { smartToast } from "@/utils/toast";

interface FileUploaderProps {
  initialFileUrl?: string;
  exportFileData: (data: ICloudinaryFile) => void;
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
  folder = "media-files",
  trigger = <FcCamera size={30} />,
  showName,
  fileStyles,
  accept = "image",
  hidePreview = false,
}: FileUploaderProps) => {
  const [upload, { isLoading }] = useUploadImageMutation();

 

  const [uploadedFile, setUploadedFile] = useState<ICloudinaryFile | null>(
    null,
  );

  const currentSrc =
    uploadedFile?.thumbnail_url || initialFileUrl || staticImages.avatar;

  async function handleFileSelection(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    try {
  
      const file = event.target.files ? event.target.files[0] : null;
      if (!file) {
        smartToast({
          message: ` File not selected `,
          success: false,
        });
        return;
      }
      if (file.size > maxSize) {
        smartToast({
          message: ` File should not exceed ${bytesToMB(maxSize)}`,
          success: false,
        });
        return;
      }

      // const fileString = await getFilePath(file);

      const fileString = URL.createObjectURL(file);

      //Now Upload
      if (fileString) {
        const formdata = new FormData();
        formdata.append("image", file);
        formdata.append("folder", folder);
        const result = await upload(formdata).unwrap();

        smartToast(result);

        if (!result.success) {
          setUploadedFile(null);
          return;
        }
        setUploadedFile(result.data as ICloudinaryFile);
        exportFileData(result.data as ICloudinaryFile);
      }
    } catch (error) {
      smartToast({ error });
    }
  }
  return (
    <div
      className={`relative grid gap-1 justify-center items-center text-sm ${className}`}
    >
      <OverlayLoader isLoading={isLoading} />
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
        aria-disabled={isLoading}
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
          disabled={isLoading}
        />
      </label>
    </div>
  );
};

export default FileUploader;
