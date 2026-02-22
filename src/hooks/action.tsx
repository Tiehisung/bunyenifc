import { fireDoubleEscape } from "@/hooks/Esc";
import { apiConfig } from "@/lib/configs";
import { IQueryResponse } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "@/lib/error";

interface IProps {
  loadingText?: string;
  uri?: string;
  method: "PUT" | "POST" | "DELETE" | "GET";
  body?: object;
  escapeOnEnd?: boolean;
  showLoader?: boolean;
  showToast?: boolean;
  goBackAfter?: boolean;
}

export function useAction() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAction = async ({
    method = "GET",
    body,
    uri,
    escapeOnEnd = false,
    showToast,
    goBackAfter,
  }: IProps) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        uri?.startsWith(apiConfig.base)
          ? uri
          : uri?.startsWith("/")
            ? `${apiConfig.base}${uri}`
            : `${apiConfig.base}/${uri}`,
        {
          method,
          headers: { "Content-Type": "application/json" },
          cache: "no-cache",
          body: JSON.stringify({
            ...body,
          }),
        },
      );
      const results: IQueryResponse = await response.json();
      if (results.success) {
        if (showToast)
          toast.success(results.message, { position: "bottom-center" });
        setError("");
        if (goBackAfter) navigate(-1);
      } else {
        if (showToast) toast.error(results.message);
        setError(getErrorMessage(error));
      }
    } catch (error) {
      if (showToast) toast.error(getErrorMessage(error));
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
      // Note: React Router doesn't have a direct refresh equivalent
      // You might want to trigger a re-fetch or use location state
      // window.location.reload(); // Uncomment if full page refresh is needed
      if (escapeOnEnd) fireDoubleEscape();
    }
  };

  return { handleAction, isLoading, error };
}
