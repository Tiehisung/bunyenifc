import { ArrowLeft, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { useNavigate } from "react-router-dom";
import { Button } from "../buttons/Button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatError } from "@/lib/error";

interface Props {
  message: any;
  onRefetch?: () => void;
}
const DataErrorAlert = ({ message, onRefetch }: Props) => {
  const navigate = useNavigate();
  const [reloading, setReloading] = useState(false);

  const handleReloading = () => {
    setReloading(true);
    
    if (onRefetch) {
      onRefetch();
    } else {
      navigate(0);
    }
    setTimeout(() => {
      setReloading(false);
    }, 5000);
  };
  return (
    <div>
      <Alert variant="destructive">
        <AlertDescription>{formatError(message)}</AlertDescription>
        <Button onClick={() => navigate(-1)} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Staff
        </Button>
        <Button onClick={handleReloading} className="mt-4">
          <RefreshCcw
            className={cn("mr-2 h-4 w-4", reloading ? "animate-spin" : "")}
          />
          Reload
        </Button>
      </Alert>
    </div>
  );
};

export default DataErrorAlert;
