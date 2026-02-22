 
import { pitch } from "@/assets/images/pitch";
import { ThumbsGallery } from "@/components/carousel/ThumbsGallery";
import { useIsMobile } from "@/hooks/use-mobile";
import { IFileProps } from "@/types/file.interface";
 

export function PitchGallery() {
  const isMobile = useIsMobile("md");
  const slides = [
    {
      secure_url: pitch.dimensions,
      description: "Pitch Dimemsions",
      name: "Know the dimensions of a standard pitch",
      _id: "1",
    },
    {
      secure_url: pitch.labeling,
      description: "Labeled Pitch",
      name: "Know the parts of your pitch",
      _id: "2",
    },
    {
      secure_url: pitch.positioning,
      description: "Pitch Positions",
      name: "Positions",
      _id: "3",
    },
    {
      secure_url: pitch.positions,
      description: "Player Positions",
      name: "Where to position players",
      _id: "4",
    },
  ] as unknown as IFileProps[];
  return (
    <div className="_page px-4">
      <ThumbsGallery
        images={slides}
        swiperStyles={{ width: "100%" }}
        slideStyles={{
          width: isMobile ? "100%" : "70%",
          maxHeight: "500px",
          backgroundColor: "var(--background)",
        }}
        descriptionStyles="flex flex-col justify-center items-center"
        thumbnailSwiperStyles={{
          margin: "auto",
          height: "70px",
          width: "100%",
          maxWidth: isMobile ? "100%" : "600px",
        }}
        thumbnailSlideStyles={{
          width: isMobile ? "20%" : "25%",
          height: "60px",
        }}
        className=""
        enableBlur
      />
    </div>
  );
}
