import { useState, useRef, useEffect } from "react";
import { useUploadVideoMutation } from "@/services/upload.endpoints";
import { Button } from "@/components/buttons/Button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Video,
  Play,
  Pause,
  Trash2,
  CheckCircle,
  AlertCircle,
  UploadCloud,
  Film,
  Loader2,
} from "lucide-react";
import { bytesToMB } from "@/lib";

interface VideoUploaderProps {
  /** Called when upload is successful */
  onUploadSuccess?: (videoData: VideoUploadResult) => void;
  /** Called when upload fails */
  onUploadError?: (error: string) => void;
  /** Called when video is removed */
  onRemove?: () => void;
  /** Initial video URL (for editing) */
  initialVideo?: string;
  /** Maximum file size in bytes (default: 100MB) */
  maxSize?: number;
  /** Allowed video types */
  allowedTypes?: string[];
  /** Upload folder in Cloudinary */
  folder?: string;
  /** Show preview after upload */
  showPreview?: boolean;
  /** Custom class name */
  className?: string;
  /** Button text */
  buttonText?: string;
  /** Disable upload */
  disabled?: boolean;
}

export interface VideoUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  format?: string;
  duration?: number;
  bytes: number;
  width?: number;
  height?: number;
  thumbnail?: string;
}

export function VideoUploader({
  onUploadSuccess,
  onUploadError,
  onRemove,
  initialVideo,
  maxSize = 100 * 1024 * 1024, // 100MB default
  allowedTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"],
  folder = "videos",
  showPreview = true,
  className = "",
  buttonText = "Upload Video",
  disabled = false,
}: VideoUploaderProps) {
  const [uploadVideo, { isLoading }] = useUploadVideoMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(initialVideo || null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedData, setUploadedData] = useState<VideoUploadResult | null>(
    null,
  );
  const [isDragging, setIsDragging] = useState(false);

  // Format duration (seconds to MM:SS)
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Validate video file
  const validateVideo = (file: File): string | null => {
    if (!file.type.startsWith("video/")) {
      return "File must be a video";
    }

    if (!allowedTypes.includes(file.type)) {
      return `Invalid video type. Allowed: ${allowedTypes.map((t) => t.split("/")[1]).join(", ")}`;
    }

    if (file.size > maxSize) {
      return `File too large. Maximum size: ${bytesToMB(maxSize)}`;
    }

    return null;
  };

  // Handle file selection
  const handleFileSelect = (file: File) => {
    const validationError = validateVideo(file);
    if (validationError) {
      setError(validationError);
      onUploadError?.(validationError);
      return;
    }

    setError(null);
    setVideoFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setVideoUrl(url);

    // Reset states
    setUploadProgress(0);
    setUploadedData(null);

    // Load video metadata
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      setDuration(video.duration);
      URL.revokeObjectURL(video.src);
    };
    video.src = url;
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!videoFile) return;

    try {
      setError(null);
      setUploadProgress(10); // Start progress

      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("folder", folder);

      // Simulate progress (since RTK Query doesn't have built-in progress)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const response = await uploadVideo(formData).unwrap();
      clearInterval(progressInterval);
      setUploadProgress(100);

      const result: VideoUploadResult = {
        url: response.data.url,
        secure_url: response.data.secure_url,
        public_id: response.data.public_id,
        duration: duration,
        // format: response.data.format,
        // bytes: response.data.bytes,
        width: response.data.width,
        height: response.data.height,
        thumbnail: `${response.data.url}.jpg`,
        format: "",
        bytes: 0,
      };

      setUploadedData(result);
      onUploadSuccess?.(result);

      // Clean up preview URL
      if (videoUrl && !initialVideo) {
        URL.revokeObjectURL(videoUrl);
      }
    } catch (err: any) {
      setError(err?.data?.message || "Upload failed");
      onUploadError?.(err?.data?.message || "Upload failed");
      setUploadProgress(0);
    }
  };

  // Handle remove
  const handleRemove = () => {
    setVideoFile(null);
    if (videoUrl && !initialVideo) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoUrl(initialVideo || null);
    setUploadProgress(0);
    setError(null);
    setUploadedData(null);
    setDuration(0);
    setCurrentTime(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onRemove?.();
  };

  // Video controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoUrl && !initialVideo) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl, initialVideo]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(",")}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isLoading}
      />

      {/* Error message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Upload area */}
      {!videoFile && !uploadedData && !initialVideo ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
                        border-2 border-dashed rounded-lg p-8
                        flex flex-col items-center justify-center
                        transition-colors cursor-pointer
                        ${
                          isDragging
                            ? "border-primary bg-primary/5"
                            : "border-gray-300 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800"
                        }
                        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                    `}
        >
          <Film className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium mb-2">
            Click to upload or drag and drop
          </p>
          <p className="text-sm text-gray-500 mb-2">
            MP4, WebM, OGV, MOV (Max: {bytesToMB(maxSize)})
          </p>
          <Button type="button" variant="outline" disabled={disabled}>
            <UploadCloud className="h-4 w-4 mr-2" />
            {buttonText}
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg p-4 space-y-4">
          {/* Video preview */}
          {videoUrl && showPreview && (
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full max-h-96"
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
                controls={false}
              />

              {/* Custom video controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-4">
                <div className="flex items-center gap-2 text-white">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={togglePlay}
                    className="text-white hover:text-white hover:bg-white/20"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </Button>

                  <span className="text-sm">
                    {formatDuration(currentTime)} / {formatDuration(duration)}
                  </span>

                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* File info */}
          {videoFile && (
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Video className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium truncate max-w-xs">
                    {videoFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {bytesToMB(videoFile.size)} •{" "}
                    {videoFile.type.split("/")[1].toUpperCase()}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={handleRemove}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          )}

          {/* Upload progress */}
          {isLoading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Uploaded data info */}
          {uploadedData && (
            <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700 dark:text-green-300">
                Video uploaded successfully!
                <br />
                <span className="text-sm">
                  Duration: {formatDuration(uploadedData?.duration as number)} • Size:{" "}
                  {bytesToMB(uploadedData.bytes)}
                </span>
              </AlertDescription>
            </Alert>
          )}

          {/* Action buttons */}
          {videoFile && !uploadedData && (
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleUpload}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-4 w-4 mr-2" />
                    Upload Video
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleRemove}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          )}

          {/* Edit mode - already has video */}
          {initialVideo && !videoFile && !uploadedData && (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Replace Video
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleRemove}
              >
                Remove
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
