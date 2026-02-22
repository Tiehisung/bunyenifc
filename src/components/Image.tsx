import { staticImages } from "@/assets/images";
import { IFileProps } from "@/types/file.interface";

import { useState } from "react";

interface IFallbackImgProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  fill?: boolean;
  priority?: boolean;
}

export default function IMAGE({
  src,
  alt,
  fallbackSrc,
  ...props
}: IFallbackImgProps) {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc(fallbackSrc);
  };

  return <img src={imgSrc} alt={alt} onError={handleError} {...props} />;
}
interface IProps {
  file: Partial<IFileProps>;
  caption?: string;
  className?: string;
}

export function SlideImage({ file, className = "", caption = "" }: IProps) {
  return (
    <div
      className={`w-full h-full overflow-hidden bg-card hover:shadow-lg transition-shadow relative ${className}`}
    >
      <img
        src={(file?.secure_url as string) ?? staticImages.ball}
        alt={
          file?.name ||
          file?.original_filename ||
          `slide image - ${file?.width}"X"${file?.height}`
        }
        className="w-full h-full object-cover"
        loading="lazy"
        width={500}
        height={500}
      />

      <div>
        {caption && (
          <div
            className={`p-4 bg-linear-to-b from-transparent via-modalOverlay to-modalOverlay z-10 absolute bottom-0 right-0 left-0 w-full`}
          >
            <h3 className="font-bold text-lg uppercase text-white text-center">
              {caption}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
