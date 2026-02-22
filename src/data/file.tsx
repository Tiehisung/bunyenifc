import { ReactNode } from "react";
import { BsFillFileTextFill } from "react-icons/bs";
import {
  FaFilePowerpoint,
  FaFilePdf,
  FaImage,
  FaFileExcel,
} from "react-icons/fa6";
import { GoVideo } from "react-icons/go";
import { MdAudiotrack } from "react-icons/md";
import { PiMicrosoftWordLogoFill } from "react-icons/pi";
import { TbFileUnknown } from "react-icons/tb";
import {
  ImageMimeTypes,
  VideoMimeTypes,
  AudioMimeTypes,
  DocMimeTypes,
} from "@/types/enumerators";
import { Color } from "@/styles";

/**
 * Icons predefined for file types
 */
export const fileIcons: Array<{
  type: TFileTypeName;
  url?: ReactNode;
  icon?: ReactNode;
}> = [
  { type: "word", icon: <PiMicrosoftWordLogoFill color={Color.blue} /> },
  { type: "powerpoint", icon: <FaFilePowerpoint color={Color.red} /> },
  { type: "textfile", icon: <BsFillFileTextFill color={Color.grey} /> },
  { type: "audio", icon: <MdAudiotrack color={Color.grey} /> },
  { type: "video", icon: <GoVideo color={Color.red} /> },
  { type: "pdf", icon: <FaFilePdf color={Color.red} /> },
  { type: "image", icon: <FaImage color={Color.grey} /> },
  { type: "unknown", icon: <TbFileUnknown color={Color.red} /> },
  { type: "excel", icon: <FaFileExcel color={Color.green} /> },
];

export type TFileTypeName =
  | "image"
  | "video"
  | "word"
  | "powerpoint"
  | "pdf"
  | "textfile"
  | "audio"
  | "excel"
  | "unknown";

/**
 * Returns file type e.g image for image/* mimes
 * @param mimeType Mime type of any file so handled or resource_type
 * @returns
 */
export const getFileTypeName = (mimeType: string): TFileTypeName => {
  if (Object.values(ImageMimeTypes).find(mt => mt.includes(mimeType as ImageMimeTypes))) return "image";
  if (Object.values(VideoMimeTypes).find(mt => mt.includes(mimeType as VideoMimeTypes))) return "video";
  if (Object.values(AudioMimeTypes).find(mt => mt.includes(mimeType as AudioMimeTypes))) return "audio";
  if ((DocMimeTypes.DOC + DocMimeTypes.DOCX).includes(mimeType as DocMimeTypes)) return "word";
  if (Object.values(DocMimeTypes).find(mt => mt.includes(mimeType as DocMimeTypes))) return "word";

  if (mimeType === DocMimeTypes.DOC || mimeType === DocMimeTypes.DOCX) return "word";
  if (mimeType === DocMimeTypes.PPT || mimeType === DocMimeTypes.PPTX) return "powerpoint";
  if (mimeType === DocMimeTypes.PDF) return "pdf";
  if (mimeType === DocMimeTypes.TXT || mimeType === DocMimeTypes.CSV) return "textfile";
  if (mimeType === DocMimeTypes.XLS || mimeType === DocMimeTypes.XLSX) return "excel";
  return "unknown";
};
