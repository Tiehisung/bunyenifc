import { fireEscape } from "@/hooks/Esc";
import { ICldFileUploadResult } from "@/types/file.interface";
import { X } from "lucide-react";
import { ReactNode, useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "../buttons/Button";
import { TButtonSize, TButtonVariant } from "../ui/button";

interface ICloudinaryUploaderProps {
  uploadPreset?: string;
  multiple?: boolean;
  maxFiles?: number;
  folder?: string;
  resourceType?: "image" | "video" | "raw" | "auto";
  deletable?: boolean;
  hidePreview?: boolean;

  trigger?: ReactNode;
  triggerId?: string;
  variant?: TButtonVariant;
  triggerSize?: TButtonSize;
  
  dismissOnComplete?: boolean;
  cropping?: boolean;
  successMessage?: string;
  clearTrigger?: number;
  wrapperStyles?: string;
  setUploadedFiles: (files: ICldFileUploadResult[]) => void;
  mediaDisplayStyles?: string;
  maxFileSize?:
    | "2_000_000"
    | "5_000_000"
    | "10_000_000"
    | "20_000_000"
    | "40_000_000"
    | "60_000_000"
    | "80_000_000"
    | "100_000_000";
}

export default function CloudinaryUploader({
  multiple = true,
  maxFiles = 4,
  folder = "media",
  clearTrigger,
  setUploadedFiles,
  resourceType = "auto",
  deletable = true,
  hidePreview = false,

  // Trigger
  trigger = "Upload Media",
  triggerId = "cloudinary-uploader",
  triggerSize = "default",
  variant='outline',

  dismissOnComplete = true,
  cropping = false,
  successMessage,
  wrapperStyles,
  mediaDisplayStyles,
  maxFileSize = "20_000_000",
}: ICloudinaryUploaderProps) {
  const [files, setFiles] = useState<ICldFileUploadResult[]>([]);
  const [loaded, setLoaded] = useState(false);
  const widgetRef = useRef<any>(null);

  // Load Cloudinary widget script
  useEffect(() => {
    if (!loaded && typeof window !== "undefined") {
      const script = document.createElement("script");
      script.setAttribute("async", "");
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.addEventListener("load", () => setLoaded(true));
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [loaded]);

  useEffect(() => {
    setFiles([]);
  }, [clearTrigger]);

  useEffect(() => {
    if (files) {
      setUploadedFiles(files);
    }
  }, [files, setUploadedFiles]);

  const allowedFormats =
    resourceType === "image"
      ? ["jpg", "png", "jpeg", "webp"]
      : resourceType === "video"
        ? ["mp4", "mov", "avi", "webm"]
        : [
            "jpg",
            "png",
            "jpeg",
            "mp4",
            "mov",
            "webm",
            "webp",
            "avi",
            "mkv",
            "flv",
            "wmv",
            "m4v",
          ];

  const handleRemove = async (public_id: string) => {
    try {
      const updatedFiles = files.filter((f) => f.public_id !== public_id);
      setFiles(updatedFiles);
      setUploadedFiles(updatedFiles);

      // Optionally hit your API to delete from Cloudinary
      const res = await fetch("/api/deleteFile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id }),
      });

      if (!res.ok) throw new Error("Failed to delete file");
      toast.success("File deleted successfully");
    } catch {
      // toast.error("Failed to delete file");
    }
  };

  const openUploadWidget = () => {
    if (!loaded) {
      toast.error("Upload widget is still loading...");
      return;
    }

    const uploadOptions = {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
      uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      sources: ["local", "camera", "url", "google_drive", "image_search"],
      multiple,
      maxFiles,
      folder,
      resourceType: resourceType ?? "auto",
      clientAllowedFormats: allowedFormats,
      maxFileSize: Number(maxFileSize.replace(/_/g, "")), // Convert "20_000_000" to 20000000
      theme: "minimal",
      showPoweredBy: false,
      cropping: cropping,
      styles: {
        palette: {
          window: "#ffffff",
          windowBorder: "#90a0b3",
          tabIcon: "#0078ff",
          menuIcons: "#5a616a",
          textDark: "#000000",
          textLight: "#ffffff",
          link: "#0078ff",
          action: "#ff620c",
          inactiveTabIcon: "#0e2f5a",
          error: "#f44235",
          inProgress: "#0078ff",
          complete: "#20b832",
          sourceBg: "#e4ebf1",
        },
      },
    };

    widgetRef.current = (window as any).cloudinary?.openUploadWidget(
      uploadOptions,
      (error: any, result: any) => {
        if (error) {
          console.error("Upload error:", error);
          toast.error("Upload failed");
          return;
        }

        if (result?.event === "success") {
          const file = result.info as ICldFileUploadResult;
          setFiles((prev) => {
            const updated = [...prev, file];
            setUploadedFiles(updated);
            return updated;
          });

          if (successMessage) toast.success(successMessage);
        }

        if (result?.event === "queues-end" && dismissOnComplete) {
          fireEscape();
        }
      },
    );
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${wrapperStyles}`}>
      {/* Upload Trigger */}
      <Button
        id={triggerId}
        onClick={openUploadWidget}
        className={`text-foreground ${!loaded ? "opacity-50 pointer-events-none" : ""}`}
        variant={variant}
        size={triggerSize}
      >
        {trigger}
      </Button>

      {/* Uploaded previews */}
      {!hidePreview && files?.length > 0 && (
        <div
          className={`flex items-center flex-wrap justify-center gap-3 mt-4 ${mediaDisplayStyles}`}
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
                  className="rounded-lg object-cover w-full h-full max-w-75"
                />
              ) : (
                <img
                  src={f.secure_url}
                  alt={f.original_filename ?? "Uploaded file"}
                  className="rounded-lg object-cover w-full h-full max-w-75 max-h-75"
                  loading="lazy"
                />
              )}

              {deletable && (
                <button
                  type="button"
                  onClick={() => handleRemove(f.public_id)}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Add type declaration for window.cloudinary
declare global {
  interface Window {
    cloudinary: any;
  }
}
