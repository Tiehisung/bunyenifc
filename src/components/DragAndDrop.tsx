import { useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";
 
import { apiConfig } from "@/lib/configs";
import { useNavigate } from "react-router-dom";
import { IQueryResponse } from "@/types";
import { fireDoubleEscape } from "@/hooks/Esc";
import { getFilePath, validateFile } from "@/lib/file";
import { ICldFileUploadResult } from "@/types/file.interface";
import { getErrorMessage } from "@/lib/error";

export const DragAndDropUpload = ({
  onChange,
  className,
  fileType = "pdf",
  children,
  folder = "files",
  escapeOnEnd,
  exportRaw,
  maxFileSize = 100000000,
}: {
  onChange: (file: ICldFileUploadResult) => void;
  className?: string;
  error?: string;
  fileType: "image" | "pdf" | "video" | "all";
  children: ReactNode;
  folder?: string;
  escapeOnEnd?: boolean;
  maxFileSize?: number;
  exportRaw?: (file: File) => void;
}) => {
  const [file, setFile] = useState<File | null | undefined>(null);
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleUpload = async () => {
    try {
      const { status, message } = validateFile(
        file as File,
        fileType,
        maxFileSize,
      );

      if (!status) {
        toast.error(message);
        return;
      }

      setIsUploading(true);

      const response = await fetch(apiConfig.fileUpload, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file?.name,
          path: await getFilePath(file as File),
          preset: "konjiehifc",
          folder,
          presetType: "authenticated",
        }),
      });

      const result: IQueryResponse<ICldFileUploadResult> =
        await response.json();

      if (result.success) {
        setFile(null);
        toast.success(result.message);
        // Use navigate(0) as a soft refresh instead of router.refresh()
        navigate(0);
        onChange(result?.data as ICldFileUploadResult);
        if (escapeOnEnd) fireDoubleEscape(500);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      const { status, message } = validateFile(file, fileType, maxFileSize);
      if (status) {
        setFile(file);
      } else {
        toast.error(message);
        return;
      }
    }
    setIsDragOver(false);
  };

  // Controller
  useEffect(() => {
    if (exportRaw) {
      exportRaw(file as File);
    } else {
      if (file) handleUpload();
    }
  }, [file, exportRaw]);

  return (
    <div
      className={`border-2 ${isUploading ? "pointer-events-none" : ""} ${
        isDragOver ? "border-dotted border-Green" : "border-transparent"
      } ${className || ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragOver(false);
      }}
      onDrop={handleDrop}
    >
      {children}
      {/* <OverlayLoader isLoading={isUploading} /> */}
    </div>
  );
};
