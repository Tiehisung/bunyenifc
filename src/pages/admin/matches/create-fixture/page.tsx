import CreateMatch from "../CreateFixture";
import { useGetTeamsQuery } from "@/services/team.endpoints";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const NewFixturePage = () => {
  const { data: teamsData, isLoading, error } = useGetTeamsQuery({});
  const teams = teamsData;

  if (isLoading) {
    return (
      <div className="_page py-14">
        <div className="flex justify-center items-center min-h-100">
          <Loader message="Loading teams..." />
        </div>
      </div>
    );
  }

  if (error || !teams?.data?.length) {
    return (
      <div className="_page py-14">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error ? "Failed to load teams" : "No teams available"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="_page py-14">
      <div className="">
        <h1 className="_title">CREATE FIXTURE</h1>
        <CreateMatch teams={teams?.data} />
      </div>
    </div>
  );
};

export default NewFixturePage;
