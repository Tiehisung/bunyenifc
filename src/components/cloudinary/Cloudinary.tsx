// components/CloudinaryWidget.tsx
import { useEffect, useRef, useCallback, useState, ReactNode } from "react";
import { Button } from "@/components/buttons/Button";
import { Upload, X } from "lucide-react";
import { TButtonVariant } from "../ui/button";
import { ICloudinaryFile } from "@/types/file.interface";
import { smartToast } from "@/utils/toast";
import { useDeleteFileMutation } from "@/services/upload.endpoints";

declare global {
  interface Window {
    cloudinary: any;
  }
}

interface CloudinaryWidgetProps {
  onUploadSuccess?: (files: ICloudinaryFile[]) => void;
  onUploadFailure?: (error: any) => void;

  initialFiles?: ICloudinaryFile[];

  trigger?: ReactNode;
  variant?: TButtonVariant;
  className?: string;

  cloudName?: string;
  uploadPreset?: string;
  folder?: string;
  cropping?: boolean;
  multiple?: boolean;
  maxFiles?: number;

  resourceType?: "image" | "video" | "auto";
  maxFileSize?:
    | "2_000_000"
    | "5_000_000"
    | "10_000_000"
    | "20_000_000"
    | "40_000_000"
    | "60_000_000"
    | "80_000_000"
    | "100_000_000";

  deletable?: boolean;
  hidePreview?: boolean;
  mediaDisplayStyles?: string;
}

export function CloudinaryWidget({
  onUploadSuccess,
  onUploadFailure,

  trigger = "Upload Image",
  variant = "outline",
  className = "",

  folder = "bunyeni-fc",
  cropping = false,
  multiple = true,
  maxFiles = 1,
  resourceType = "image",
  maxFileSize = "10_000_000",

  deletable = true,
  hidePreview = false,
  mediaDisplayStyles,

  initialFiles = [],

  cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
}: CloudinaryWidgetProps) {
  const widgetRef = useRef<any>(null);

  // UI state (important for preview)
  const [files, setFiles] = useState<ICloudinaryFile[]>(initialFiles);

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  const [deleteFile] = useDeleteFileMutation();

  // Load Cloudinary script
  useEffect(() => {
    if (window.cloudinary) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.async = true;

    script.onload = () => setIsScriptLoaded(true);

    script.onerror = () => {
      setScriptError(true);
      onUploadFailure?.(new Error("Failed to load widget"));
    };

    document.body.appendChild(script);
  }, []);

  // Initialize widget
  useEffect(() => {
    if (!isScriptLoaded || !window.cloudinary) return;

    try {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName,
          uploadPreset,
          folder,
          sources: ["local", "camera", "dropbox", "google_drive"],
          multiple,
          maxFiles,
          cropping: multiple || maxFiles > 1 ? false : cropping,
          croppingAspectRatio: 1,
          clientAllowedFormats:
            resourceType === "image" ? ["image"] : undefined,
          maxImageFileSize: 5000000,
          maxVideoFileSize: Number(maxFileSize.replace(/_/g, "")),
        },
        (error: any, result: any) => {
          if (error) {
            onUploadFailure?.(error);
            return;
          }

          if (result?.event === "success") {
            const file = result.info as ICloudinaryFile;

            setFiles((prev) => {
              const updated = [...prev, file];
              onUploadSuccess?.(updated);
              return updated;
            });
          }

          if (result?.event === "close") {
            console.log({ files: "closed" });
          }
        },
      );
    } catch (error) {
      setScriptError(true);
      onUploadFailure?.(error);
    }
  }, [isScriptLoaded]);

  const openWidget = useCallback(() => {
    widgetRef.current?.open();
  }, []);

  // Remove file
  const handleRemove = async (file: ICloudinaryFile) => {
    try {
      const updated = files.filter((f) => f.public_id !== file.public_id);

      setFiles(updated);

      await deleteFile({
        public_id: file.public_id,
        resource_type: file.resource_type as ICloudinaryFile["resource_type"],
      });
    } catch (error) {
      smartToast({ error });
    }
  };

  useEffect(() => {
    if (files) {
      onUploadSuccess?.(files);
    }
  }, [files]);

  // Error UI
  if (scriptError) {
    return (
      <div className="text-red-500 border p-4 rounded">
        Upload widget failed to load
      </div>
    );
  }

  // Loading UI
  if (!isScriptLoaded) {
    return (
      <Button disabled>
        <Upload className="animate-pulse mr-2" />
        Loading uploader...
      </Button>
    );
  }

  return (
    <div className="space-y-5">
      {!hidePreview && files.length > 0 && (
        <div
          className={`flex flex-wrap justify-center gap-3 mt-4 ${mediaDisplayStyles}`}
        >
          {files.map((f) => (
            <div
              key={f.public_id}
              className="relative rounded-lg overflow-hidden group max-h-80"
            >
              {f.resource_type === "video" ? (
                <video
                  src={f.secure_url}
                  controls
                  className="rounded-lg object-cover"
                />
              ) : (
                <img
                  src={f.secure_url}
                  alt=""
                  className="rounded-lg object-cover"
                />
              )}

              {deletable && (
                <button
                  type="button"
                  onClick={() => handleRemove(f)}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full transition"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      <Button
        type="button"
        onClick={openWidget}
        className={`flex items-center gap-2 ${className}`}
        variant={variant}
      >
        {trigger}
      </Button>
    </div>
  );
}
