import { useUpdateSearchParams } from "@/hooks/params";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "./buttons/Button";
import { Grid, List } from "lucide-react";

export type TDisplayType = "grid" | "list";

export const DisplayType = ({
  className,
  defaultDisplay,
}: {
  className?: string;
  defaultDisplay: TDisplayType;
}) => {
  const { setParam } = useUpdateSearchParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const handleClick = (display: "grid" | "list") => {
    setParam("display", display);
  };

  const [display, setDisplay] = useState<TDisplayType>(
    defaultDisplay ?? "grid",
  );

  useEffect(() => {
    const str = searchParams.get("display") as TDisplayType | null;
    if (str) {
      setDisplay(str);
    } else if (defaultDisplay) {
      setDisplay(defaultDisplay);
    }
  }, [searchParams, defaultDisplay]);

  return (
    <div
      className={`flex items-center gap-1.5 border p-2 rounded-md text-2xl ${className}`}
    >
      <span className="text-sm">View</span>
      <Button
        className={`p-2 rounded-md`}
        onClick={() => handleClick("grid")}
        title="Grid View"
        variant={display === "grid" ? "outline" : "ghost"}
      >
        <Grid />
      </Button>

      <Button
        title="List View"
        className={`p-2 rounded-md`}
        onClick={() => handleClick("list")}
        variant={display === "list" ? "outline" : "ghost"}
      >
        <List />
      </Button>
    </div>
  );
};
