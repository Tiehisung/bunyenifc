import Cropper, { Area, Point } from "react-easy-crop";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface IProps {
  shape?: "round" | "rect";
  image: string;
  containerClassName?: string;
}
export default function ImageCropper({
  image,
  shape = "round",
  ...props
}: IProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = (_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
    handleSave();
  };

  const handleSave = async () => {
    if (!croppedAreaPixels) return;

    const blob = await getCroppedImg(image, croppedAreaPixels);

    // convert Blob → File (important for multer)
    const file = new File([blob], "cropped.jpg", {
      type: "image/jpeg",
    });

    console.log(file);
  };

  return (
    <>
      <div className="relative w-72 h-72">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          cropShape={shape}
          classes={{
            containerClassName: cn("border-8", props.containerClassName),
          }}
          //   showGrid={false}
          cropSize={{ width: 200, height: 200 }}
        />
      </div>

      <button onClick={handleSave}>Save Crop</button>
    </>
  );
}

/**
 * Loads image into HTMLImageElement
 */
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

/**
 * Returns cropped image as Blob
 */
export async function getCroppedImg(
  imageSrc: string,
  crop: Area,
): Promise<Blob> {
  const image = await createImage(imageSrc);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas context not found");

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      0.9,
    );
  });
}
