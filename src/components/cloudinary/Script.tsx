// components/CloudinaryWidget.tsx
import { useEffect, useRef, useCallback, useState } from "react";
import { Button } from "@/components/buttons/Button";
import { Upload } from "lucide-react";

declare global {
  interface Window {
    cloudinary: any;
  }
}

interface CloudinaryWidgetProps {
  onUploadSuccess?: (result: any) => void;
  onUploadFailure?: (error: any) => void;
  buttonText?: string;
  cloudName?: string;
  uploadPreset?: string;
  folder?: string;
  cropping?: boolean;
  multiple?: boolean;
  maxFiles?: number;
  resourceType?: "image" | "video" | "auto";
  className?: string;
}

export function CloudinaryWidget({
  onUploadSuccess,
  onUploadFailure,
  buttonText = "Upload Image",
  cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  folder = "bunyeni-fc",
  cropping = true,
  multiple = false,
  maxFiles = 1,
  resourceType = "image",
  className = "",
}: CloudinaryWidgetProps) {
  const widgetRef = useRef<any>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  // Load script dynamically with proper error handling
  useEffect(() => {
    // Check if already loaded
    if (window.cloudinary) {
      setIsScriptLoaded(true);
      return;
    }

    // Check if script tag already exists
    const existingScript = document.querySelector(
      'script[src*="widget.cloudinary.com"]',
    );

    if (existingScript) {
      // Script exists but might not be loaded yet
      const checkInterval = setInterval(() => {
        if (window.cloudinary) {
          setIsScriptLoaded(true);
          clearInterval(checkInterval);
        }
      }, 100);

      setTimeout(() => clearInterval(checkInterval), 10000); // Timeout after 10s
      return;
    }

    // Create and load script
    const script = document.createElement("script");
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.async = true;
    script.onload = () => {
      console.log("✅ Cloudinary script loaded");
      setIsScriptLoaded(true);
    };
    script.onerror = () => {
      console.error("❌ Failed to load Cloudinary script");
      setScriptError(true);
      onUploadFailure?.(new Error("Failed to load upload widget"));
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (widgetRef.current) {
        widgetRef.current.destroy?.();
      }
    };
  }, [onUploadFailure]);

  // Initialize widget when script is ready
  useEffect(() => {
    if (!isScriptLoaded || !window.cloudinary) return;

    // Validate configuration
    if (!cloudName || !uploadPreset) {
      console.error("Cloudinary configuration missing!");
      setScriptError(true);
      return;
    }

    try {
      // Use localhost instead of 127.0.0.1 to avoid Cloudinary's known issue
      if (window.location.hostname === "127.0.0.1") {
        console.warn(
          "⚠️ Using 127.0.0.1 may cause widget issues. Use localhost instead.",
        );
      }

      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName,
          uploadPreset,
          folder,
          sources: ["local", "camera", "dropbox", "google_drive"],
          multiple,
          maxFiles,
          cropping,
          croppingAspectRatio: 1,
          showAdvancedOptions: true,
          clientAllowedFormats:
            resourceType === "image" ? ["image"] : undefined,
          maxImageFileSize: 5000000, // 5MB
          maxVideoFileSize: 50000000, // 50MB
          theme: "minimal",
          styles: {
            palette: {
              window: "#ffffff",
              windowBorder: "#90a0b3",
              tabIcon: "#0078ff",
              menuIcons: "#5a616d",
              textDark: "#000000",
              textLight: "#ffffff",
              link: "#0078ff",
              action: "#ff620c",
              inactiveTabIcon: "#0e2f5a",
              error: "#f44235",
              inProgress: "#0078ff",
              complete: "#20b832",
              sourceBg: "#f4f4f4",
            },
          },
        },
        (error: any, result: any) => {
          if (error) {
            console.error("Upload error:", error);
            onUploadFailure?.(error);
            return;
          }

          if (result && result.event === "success") {
            onUploadSuccess?.(result.info);
          }
        },
      );

      setScriptError(false);
    } catch (error) {
      console.error("Error initializing widget:", error);
      setScriptError(true);
      onUploadFailure?.(error);
    }
  }, [
    isScriptLoaded,
    cloudName,
    uploadPreset,
    folder,
    cropping,
    multiple,
    maxFiles,
    resourceType,
    onUploadSuccess,
    onUploadFailure,
  ]);

  const openWidget = useCallback(() => {
    if (!widgetRef.current) {
      console.error("Widget not initialized");
      onUploadFailure?.(new Error("Widget not initialized yet"));
      return;
    }
    widgetRef.current.open();
  }, [onUploadFailure]);

  // Error state
  if (scriptError) {
    return (
      <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">
        <p className="font-medium">⚠️ Upload widget failed to load</p>
        <p className="text-sm mt-1">
          Please check your internet connection and refresh the page.
        </p>
        {(!cloudName || !uploadPreset) && (
          <p className="text-sm mt-2 text-red-600">
            Missing Cloudinary configuration. Check your environment variables.
          </p>
        )}
        <Button
          onClick={() => window.location.reload()}
          className="mt-3 text-sm"
          variant="outline"
        >
          Refresh Page
        </Button>
      </div>
    );
  }

  // Loading state
  if (!isScriptLoaded) {
    return (
      <Button disabled className={`opacity-50 cursor-not-allowed ${className}`}>
        <Upload className="h-4 w-4 mr-2 animate-pulse" />
        Loading uploader...
      </Button>
    );
  }

  // Ready state
  return (
    <Button
      type="button"
      onClick={openWidget}
      className={`flex items-center gap-2 ${className}`}
    >
      <Upload className="h-4 w-4" />
      {buttonText}
    </Button>
  );
}
