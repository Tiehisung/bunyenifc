import HEADER from "@/components/Element";
import BackToTopButton from "@/components/scroll/ToTop";
import { MVPsManager } from "./MVPsManager";
import { useSearchParams } from "react-router-dom";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGetMvpsQuery } from "@/services/mvps.endpoints";

export default function MVPsPage() {
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';

  const { 
    data: mvps, 
    isLoading, 
    error,
    isFetching 
  } = useGetMvpsQuery(queryString);

  if (isLoading) {
    return (
      <div>
        <HEADER
          title="MVPs Management"
          subtitle="Track and manage player MVPs"
        />
        <div className="_page flex justify-center items-center min-h-100">
          <Loader message="Loading MVPs..." />
        </div>
        <BackToTopButton />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <HEADER
          title="MVPs Management"
          subtitle="Track and manage player MVPs"
        />
        <div className="_page">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load MVPs: {(error as any)?.message || 'Unknown error'}
            </AlertDescription>
          </Alert>
        </div>
        <BackToTopButton />
      </div>
    );
  }

  return (
    <div>
      <HEADER
        title="MVPs Management"
        subtitle="Track and manage player MVPs"
      />

      <div className="_page">
        <MVPsManager mvpsData={mvps} />
      </div>

      {isFetching && (
        <div className="fixed bottom-4 right-4">
          <Loader size="sm" message="Updating..." />
        </div>
      )}

      <BackToTopButton />
    </div>
  );
}