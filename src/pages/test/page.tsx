import { GalleryUploader } from "@/components/files/gallery-uploader";
import { VideoUploader } from "@/components/files/video/uploader";
import { ImageUploader } from "@/components/files/image-uploader";
import GroupedAdminSidebar from "../admin/(sidebar)/GroupedSidebarLinks";
import { CloudinaryWidget } from "@/components/cloudinary/Cloudinary";
 

export default function TestPage() {
  return (
    <div className="grid md:flex items-center ">
      <GroupedAdminSidebar />
      <main className="block p-5">
        <ImageUploader />

        <br />

        <GalleryUploader />

        <br />

        <VideoUploader />
        <CloudinaryWidget />
      </main>
    </div>
  );
}
