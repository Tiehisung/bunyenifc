 

import { VscLoading } from "react-icons/vsc";

interface IOverlayLoader {
  isLoading?: boolean;
  iconClassName?: string;
  className?: string;
}

export function OverlayLoader({
  isLoading = true,
  iconClassName = "text-4xl",
  className,
}: IOverlayLoader) {
  if (!isLoading) return null;
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`absolute inset-0 z-10 flex items-center justify-center p-4 pointer-events-none ${
        isLoading ? "bg-muted/20 backdrop-blur-[1px]" : ""
      } ${className}`}
    >
      <VscLoading className={`animate-spin  ${iconClassName}`} />
    </div>
  );
}
