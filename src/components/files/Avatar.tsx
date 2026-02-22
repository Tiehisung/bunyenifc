 

import { staticImages } from "@/assets/images";
import { getFilePath } from "@/lib/file";
 
 
import React, { ReactNode, useEffect, useState } from "react";
import { FcCamera } from "react-icons/fc";
import { toast } from "sonner";

interface AvatarPickerProps {
  imageUrl?: string;
  setImageUrl: (url: string) => void;
  className?: string;
  inputId: string;
  title?: ReactNode;
  titleStyles?: string;
  inputLabel?: string;
}

const AvatarPicker = ({
  imageUrl,
  setImageUrl,
  className,
  inputId,
  title,
  titleStyles,
  inputLabel,
}: AvatarPickerProps) => {
  const [imageFile, setImageFile] = useState(imageUrl ?? "");

  useEffect(() => {
    if (setImageUrl) setImageUrl(imageFile);
  }, [imageFile]);

  async function handleImageSelection(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (!selectedFile) return;
    if (selectedFile.size > 3524000) {
      toast.error(
        selectedFile.size + " is too large. Picture should not exceed 3.5mb"
      );
      return;
    }
    setImageFile(await getFilePath(selectedFile));
  }
  return (
    <div className="w-fit flex flex-col gap-1 justify-center items-center text-sm">
      {title && <div className={titleStyles}>{title}</div>}
      <img
        src={imageFile || staticImages.avatar}
        width={300}
        height={300}
        alt="desc image"
        className={`h-36 w-36 rounded-xl shadow ${className}`}
      />
      <label
        htmlFor={`id${inputId}`}
        className="flex items-center shadow w-fit p-1 rounded mt-3 cursor-pointer"
        title="Choose file"
      >
        <FcCamera size={30} /> {inputLabel || "Choose picture"}
        <input
          id={`id${inputId}`}
          hidden
          type="file"
          onChange={handleImageSelection}
          name="image"
          className=""
          accept="image/*"
        />
      </label>
    </div>
  );
};

export default AvatarPicker;
