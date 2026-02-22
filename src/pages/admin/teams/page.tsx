import DisplayTeams from "./DisplayTeams";
import Loader from "@/components/loaders/Loader";
import { useSearchParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGetTeamsQuery } from "@/services/team.endpoints";

const TeamsFeature = () => {
  const [searchParams] = useSearchParams();
  const paramsString = searchParams.toString();
  console.log(paramsString)

  const { data: teams, isLoading, error, isFetching } = useGetTeamsQuery({});

  if (isLoading) {
    return (
      <div className="space-y-12 p-4 md:px-10 bg-card flex justify-center items-center min-h-100">
        <Loader message="Loading teams..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-12 p-4 md:px-10 bg-card">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load teams: {(error as any)?.message || "Unknown error"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-12 p-4 md:px-10 bg-card">
      <DisplayTeams teams={teams} />

      {isFetching && (
        <div className="fixed bottom-4 right-4">
          <Loader size="sm" message="Updating..." />
        </div>
      )}
    </div>
  );
};

export default TeamsFeature;
