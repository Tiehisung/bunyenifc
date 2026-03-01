// frontend/src/components/GalleryUploader.tsx
import { useState } from "react";
import { useUploadImageMutation } from "@/services/upload.endpoints";
import { Button } from "../buttons/Button";

export function ImageUploader() {
  const [uploadImage, { isLoading }] = useUploadImageMutation();
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    setPreview(URL.createObjectURL(file));

    // Upload to Cloudinary via your backend
    const formData = new FormData();
    formData.append("image", file);

    try {
       await uploadImage(formData).unwrap();
     // Save response.data.url to your database
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div>
      <input
        type="file"
        className="border rounded px-1 py-2 w-fit my-2 "
        onChange={handleFileChange}
        accept="image/*"
      />
      {preview && (
        <img src={preview} alt="Preview" style={{ maxWidth: "200px" }} />
      )}
      {isLoading && <p>Uploading...</p>}

      <Button primaryText="Clear" onClick={() => setPreview(null)} />
    </div>
  );
}