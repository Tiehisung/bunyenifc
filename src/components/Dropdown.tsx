 

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { FC, ReactNode, useState } from "react";
import { LuSlidersHorizontal } from "react-icons/lu";
import HideOnClickOutside from "./HideOnClickOutside";
import { useActionOnEsc } from "@/hooks/Esc";
import { Button, TButtonSize, TButtonVariant } from "./ui/button";
import { cn } from "@/lib/utils";

export function PrimaryDropdown({
  children,
  className,
  trigger = <MoreHorizontal size={20} />,
  triggerStyles = " ",
  id,
  hideAngle = true,
  align = "end",
  size = "icon-sm",
  variant='secondary',
}: {
  children: ReactNode;
  trigger?: ReactNode;
  className?: string;
  id?: string;
  triggerStyles?: string;
  hideAngle?: boolean;
  align?: "center" | "start" | "end";
  variant?: TButtonVariant;
  size?: TButtonSize;
}) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild id={id}>
        <Button
          variant={variant}
          size={size}
          className={cn(
            ` gap-1 flex items-center cursor-pointer bg-muted text-muted-foreground backdrop-blur-sm p-2 rounded-full `,
            triggerStyles
          )}
        >
          {trigger}
          {!hideAngle && <ChevronDown size={16} />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={`w-56 ${className}`} align={align}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Hover dropdown

export function HoverDropdown({
  children,
  openDelay = 20,
  trigger = <MoreHorizontal size={20} />,
  triggerStyles = "hover:bg-background/50 p-2",
  className,
  id,
  hideAngle = true,
}: {
  children: ReactNode;
  trigger?: ReactNode;
  openDelay?: 0 | 20 | 50 | 100 | 200 | 500;
  className?: string;
  id: string;
  triggerStyles?: string;
  hideAngle?: boolean;
}) {
  return (
    <HoverCard openDelay={openDelay}>
      <HoverCardTrigger
        className={`gap-1 flex items-center cursor-pointer ${triggerStyles}`}
        id={id}
      >
        {trigger} {!hideAngle && <ChevronDown size={16} />}
      </HoverCardTrigger>
      <HoverCardContent className={className}>{children}</HoverCardContent>
    </HoverCard>
  );
}

export const SecondaryDropdown: FC<{
  className?: string;
  wrapperStyles?: string;
  triggerStyles?: string;
  children: ReactNode;
  triggerLabel?: ReactNode;
}> = ({
  className = "",
  wrapperStyles = "",
  children,
  triggerLabel = <LuSlidersHorizontal size={20} />,
  triggerStyles = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useActionOnEsc({
    onEscape() {
      setIsOpen(false);
    },
  });

  return (
    <div className={`relative flex items-center w-fit z-50 ${wrapperStyles}`}>
      <HideOnClickOutside setIsVisible={setIsOpen}>
        <button
          type="button"
          onClick={() => setIsOpen((p) => !p)}
          className={`p-1.5 _hover _slowTrans cursor-pointer border rounded ${triggerStyles}`}
        >
          {triggerLabel}
        </button>

        <main
          className={`absolute bg-card right-0 left-auto rounded-2xl ${
            isOpen
              ? " visible _slowTrans min-w-50 sm:w-80 border top-full shadow-2xl"
              : "invisible h-0 top-6"
          } ${className}`}
        >
          {children}
        </main>
      </HideOnClickOutside>
    </div>
  );
};
