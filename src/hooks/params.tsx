import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Custom hook to get a query parameter value
const useGetParam = (queryKey: string): string => {
  const location = useLocation();
  const [paramValue, setParamValue] = useState<string | null | undefined>("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const pv = searchParams.get(queryKey);
    setParamValue(pv);
  }, [location.search, queryKey]);

  return paramValue ?? "";
};

export default useGetParam;

// Hook to update search params
export function useUpdateSearchParams() {
  const navigate = useNavigate();
  const location = useLocation();

  const setParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(location.search);

    if (value && value.length > 0) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const search = params.toString();
    navigate(`${location.pathname}${search ? `?${search}` : ""}`, {
      replace: true,
    });
  };

  const clearParams = (param?: string) => {
    if (param) {
      // Remove one param
      setParam(param, "");
      return;
    }

    // Clear all params
    navigate(location.pathname, { replace: true });
    // Note: There's no direct equivalent to router.refresh() in React Router
    // You might need to implement a custom solution or reload the page if needed
  };

  return { setParam, clearParams };
}

// Hook to clear params
export function useClearParams() {
  const navigate = useNavigate();
  const location = useLocation();

  const clearAll = () => {
    navigate(location.pathname, { replace: true });
  };

  const clearOnly = (...keys: string[]) => {
    const params = new URLSearchParams(location.search);
    keys.forEach((k) => params.delete(k));

    const search = params.toString();
    navigate(`${location.pathname}${search ? `?${search}` : ""}`, {
      replace: true,
    });
  };

  return { clearAll, clearOnly };
}

// Alternative version with window.location if you need to force a refresh
export function useClearParamsWithRefresh() {
  const navigate = useNavigate();
  const location = useLocation();

  const clearAll = () => {
    navigate(location.pathname, { replace: true });
    // Optional: force a refresh if needed
    // window.location.reload();
  };

  const clearOnly = (...keys: string[]) => {
    const params = new URLSearchParams(location.search);
    keys.forEach((k) => params.delete(k));

    const search = params.toString();
    navigate(`${location.pathname}${search ? `?${search}` : ""}`, {
      replace: true,
    });
  };

  return { clearAll, clearOnly };
}
