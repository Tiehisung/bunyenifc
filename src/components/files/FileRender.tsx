 
import { fileIcons, getFileTypeName } from "@/data/file";
import { IFileProps } from "@/types/file.interface";
 

interface FileRendererProps {
  file?: IFileProps;
  className?: string;
  controls?: boolean;
}

const FileRenderer: React.FC<FileRendererProps> = ({
  file,
  className,
  controls, 
}) => {
  const fileUrl = file?.secure_url as string;
  const fileType = file?.resource_type as string;
  const fileName = file?.original_filename;

  switch (fileType) {
    case "image":
      return (
        <img
          src={fileUrl}
          alt={fileName!}
          width={500}
          height={500}
       
          className={`max-w-full h-auto ${className}`}
     
        />
      );

    case "audio":
      return (
        <audio
          src={fileUrl}
          controls={controls}
          className={`w-full ${className}`}
        />
      );
    case "video":
      return (
        <video
          src={fileUrl}
          controls={controls}
          className={`max-w-full h-auto ${className}`}
        />
      );
    case "pdf":
    case "auto":
      return (
        <iframe
          src={fileUrl}
          title={fileName}
          className={`w-full h-64 ${className}`}
          frameBorder="0"
        />
      );

    case "unknown":
      return (
        <div
          className="text-sm text-Red tooltip flex gap-5 max-sm:flex-col justify-center items-center "
          data-tip={`Unsupported file type: ${fileName}`}
        >
          <span className="text-3xl">
            {fileIcons.find((fi) => fi.type == "unknown")?.icon}
          </span>{" "}
          Unsupported file type: {fileName}
        </div>
      );
    default:
      return (
        <div
          className={`text-3xl form-control justify-center items-center h-full ${className}`}
        >
          {
            fileIcons.find((item) => item.type == getFileTypeName(fileType))
              ?.icon
          }
        </div>
      );
  }
};

export default FileRenderer;
