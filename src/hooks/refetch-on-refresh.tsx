// hooks/use-refetch-on-refresh.ts
import { useEffect } from "react";
 

export function useRefetchOnRefresh(refetch: () => void) {
 

  useEffect(() => {
    // React Router doesn't have a direct refresh equivalent
    // This approach listens for navigation events and triggers refetch
    const handleRefresh = () => {
      refetch();
    };

    // You can use location state or custom events to trigger refreshes
    window.addEventListener("refresh-data", handleRefresh);

    return () => {
      window.removeEventListener("refresh-data", handleRefresh);
    };
  }, [refetch]);

  // Helper function to trigger refresh (can be exported if needed)
  const triggerRefresh = () => {
    window.dispatchEvent(new CustomEvent("refresh-data"));
  };

  return { triggerRefresh };
}
