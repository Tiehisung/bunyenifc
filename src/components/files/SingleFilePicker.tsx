 

import { FcMultipleCameras } from "react-icons/fc";
import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "../buttons/Button";
import { toast } from "sonner";
import { TConvertedFile } from "@/types";
import { getErrorMessage } from "@/lib/error";
import { getFilePath } from "@/lib/file";

export type TFilePicker = {
  fileStyles?: string;
  fileDisplayStyles?: string;
  className?: string;
  exportFile: (file: TConvertedFile | null) => void;
  pickerId: string;
  accept?: string;
  required?: boolean;
  label?: string;
};

export default function SingleFilePicker({
  fileStyles,
  fileDisplayStyles,
  className,
  exportFile,
  pickerId = "input-file",
  accept = "image/*",
  required = true,
  label = "Choose file",
}: TFilePicker) {
  const [convertedFile, setConvertedFile] = useState<TConvertedFile | null>(
    null
  );
  //On file selection
  const handleFileSelection = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64String = await getFilePath(file);
        setConvertedFile({
          path: base64String,
          name: file.name,
          type: file.type,
        });
      } catch (error) {
        toast.error(getErrorMessage(error, "Error converting file to base64"));
      }
    }
  };

  useEffect(() => {
    exportFile(convertedFile);
  }, [convertedFile]);
  return (
    <div className={`py-4 border p-4 ${className}`}>
      <section className="flex flex-wrap items-center gap-8 justify-between w-full">
        <label
          data-tip={label}
          htmlFor={pickerId}
          className="_secondaryBtn flex gap-2 items-center shadow w-fit p-1 rounded cursor-pointer text-sm "
        >
          <FcMultipleCameras size={30} /> {label}
          <input
            id={pickerId}
            required={required}
            type="file"
            accept={accept ?? "image/*"}
            onChange={handleFileSelection}
            name="image"
            className={`max-w-52 text-sm invisible w-0 file:text-transparent `}
          />
        </label>
      </section>

      <section
        className={`relative group  flex-wrap gap-2 p-2 pb-7 w-fit justify-start bg-white mt-6 ${
          !convertedFile ? "hidden" : "flex"
        }  ${fileDisplayStyles}`}
      >
        {convertedFile?.type?.includes("image") && (
          <img
            src={convertedFile.path}
            width={400}
            height={400}
            className={`aspect-square w-full h-auto ${fileStyles}`}
            alt="filetoupload"
          />
        )}
        {convertedFile?.type?.includes("video") && (
          <video
            src={convertedFile.path}
            controls
            className={` ${fileStyles}`}
          />
        )}
        <h2 className="w-20 truncate text-xs font-light absolute bottom-0 pl-1 text-gray-950 bg-arshTrans">
          {convertedFile?.name}
        </h2>
        {convertedFile && (
          <Button
            type="button"
            primaryText={"Remove file"}
            className="text-red-700 text-sm _deleteBtn absolute top-1 right-1.5"
            onClick={() => setConvertedFile(null)}
          />
        )}
      </section>
    </div>
  );
}
