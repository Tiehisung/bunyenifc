import { ArrowLeft, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useNavigate } from "react-router-dom";
import { Button } from "../buttons/Button";
import { cn } from "@/lib/utils";
import { formatError } from "@/lib/error";

interface Props {
  message: any;
  onRefetch?: () => void;
  isRefreshing?: boolean;
  allowBack?: boolean;
}
const DataErrorAlert = ({
  message,
  onRefetch,
  isRefreshing,
  allowBack,
}: Props) => {
  const navigate = useNavigate();

  const handleReloading = () => {
    if (onRefetch) {
      onRefetch();
    }
  };
  return (
    <div>
      <Alert variant="destructive">
        <AlertTitle>{formatError(message)}</AlertTitle>
        <AlertDescription className="flex items-center justify-center">
          {allowBack && (
            <Button onClick={() => navigate(-1)} variant={"ghost"}>
              <ArrowLeft className="  h-4 w-4" />
            </Button>
          )}
          <Button
            onClick={handleReloading}
            className="  "
            size={"icon"}
            variant={"outline"}
          >
            <RefreshCcw
              className={cn(" h-4 w-4", isRefreshing ? "animate-spin" : "")}
            />
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DataErrorAlert;
