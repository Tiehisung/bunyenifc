import { staticImages } from "@/assets/images";

import React, { ReactNode, useState } from "react";
import { FcCamera } from "react-icons/fc";
import { OverlayLoader } from "../loaders/OverlayLoader";
import { ICloudinaryFile } from "@/types/file.interface";
import { bytesToMB, shortText } from "@/lib";
import { useUploadImageMutation } from "@/services/upload.endpoints";
import { smartToast } from "@/utils/toast";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  initialFileUrl?: string;
  onUploadSuccess: (data: ICloudinaryFile) => void;
  className?: string;
  name: string;
  titleStyles?: string;
  folder?: string;
  trigger?: ReactNode;
  showName?: boolean;
  fileStyles?: string;
  maxSize?:
    | "2_000_000"
    | "5_000_000"
    | "10_000_000"
    | "20_000_000"
    | "40_000_000"
    | "60_000_000"
    | "80_000_000"
    | "100_000_000";
  hidePreview?: boolean;
}

const ImageFileUploader = ({
  initialFileUrl,
  onUploadSuccess,
  className,
  name,
  maxSize = "100_000_000",
  folder = "media-files",
  trigger = <FcCamera size={30} />,
  showName,
  fileStyles,
  hidePreview = false,
}: FileUploaderProps) => {
  const [upload, { isLoading }] = useUploadImageMutation();

  const [uploadedFile, setUploadedFile] = useState<ICloudinaryFile | null>(
    null,
  );

  const currentSrc =
    uploadedFile?.thumbnail_url || initialFileUrl || staticImages.ball;

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

      const size = Number(maxSize.replace(/_/g, ""));
      if (file.size > size) {
        smartToast({
          message: ` File should not exceed ${bytesToMB(size)}`,
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
        onUploadSuccess(result.data as ICloudinaryFile);
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
          alt={name}
          className={cn(`h-36 w-36 `, fileStyles)}
        />
      )}

      {showName && (
        <span className="text-sm line-clamp-1">
          {shortText(uploadedFile?.original_filename ?? "")}
        </span>
      )}
      <label
        htmlFor={name}
        className="flex items-center rounded mt-3 cursor-pointer mx-auto border w-fit p-2 "
        title="Choose file"
        aria-disabled={isLoading}
      >
        {trigger}
        <input
          id={name}
          hidden
          type="file"
          onChange={handleFileSelection}
          name="image"
          className=""
          accept={"image/*"}
          disabled={isLoading}
        />
      </label>
    </div>
  );
};

export default ImageFileUploader;
