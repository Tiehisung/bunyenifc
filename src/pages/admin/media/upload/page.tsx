import { useState } from "react";
import Header from "../../../../components/Element";
import CloudinaryUploader from "@/components/cloudinary/FileUploadWidget";
import { CopyButton } from "@/components/buttons/CopyBtn";
import { Button } from "@/components/buttons/Button";
import { ICldFileUploadResult } from "@/types/file.interface";
import HEADER from "../../../../components/Element";
import { ImageUploader } from "@/components/files/image-uploader";
import { GalleryUploader } from "@/components/files/gallery-uploader";
import { VideoUploader } from "@/components/files/video-uploader";

const UploadPage = () => {
  const [files, setFiles] = useState<ICldFileUploadResult[]>([]);
  const [clear, setClear] = useState(0);
  return (
    <div>
      <Header
        title="Upload Any Assets"
        subtitle="Upload to retrieve asset URL instantly"
      />

      <div className="flex flex-wrap gap-4 _card">
        <CloudinaryUploader
          triggerId={"Upload-Files"}
          setUploadedFiles={(fs) => setFiles(fs)}
          clearTrigger={clear}
          folder="/assets-storage"
          successMessage="Uploaded"
          dismissOnComplete
          maxFiles={10}
          //   deletable
          //   multiple
          //   cropping
          //   preview
          //   resourceType="auto"
          //   trigger
          //   uploadPreset=""
          //   wrapperStyles=""
        />
        <Button
          className="_deleteBtn"
          primaryText="Clear"
          onClick={() => setClear(clear + 1)}
        />
      </div>

      {/* Results Pane */}
      <main className="my-12 min-h-72 bg-card p-3.5 rounded">
        <ul hidden={files?.length < 1}>
          <li className="flex items-center gap-4 _label mb-1.5">
            <span className="w-32 grow">Name</span>
            <span className="w-20">Action</span>
          </li>
          {files?.map((f) => {
            return (
              <li key={f.asset_id} className="flex items-center gap-4">
                <p className="grow line-clamp-2">{f.original_filename}</p>

                <span className="w-24">
                  <CopyButton
                    textToCopy={f.secure_url}
                    buttonText="Copy Url"
                    className="text-xs text-nowrap flex _hover _shrink px-2 py-1 rounded _slowTrans gap-1.5"
                  />
                </span>
              </li>
            );
          })}
        </ul>
      </main>

      <HEADER title="FILE UPLOAD" />

      <main className="block p-5 space-y-12">
        <div className="border-b pb-4">
          <p>Image Upload</p>
          <ImageUploader />
        </div>

        <div className="border-b pb-4">
          <p>Gallery Uploader</p>
          <GalleryUploader />
        </div>
        <div className="border-b pb-4">
          <p>Video Uploader</p>
          <VideoUploader />
        </div>
      </main>
    </div>
  );
};

export default UploadPage;
