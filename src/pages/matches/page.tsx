import FixturesSection from "./Fixtures";
import HEADER from "@/components/Element";
import { useSearchParams } from "react-router-dom";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGetMatchesQuery } from "@/services/match.endpoints";

export default function MatchesPage() {
  const [searchParams] = useSearchParams();
  const paramsString = searchParams.toString();
  console.log(paramsString)

  const { data: fixtures, isLoading, error } = useGetMatchesQuery({});

  if (isLoading) {
    return (
      <div>
        <HEADER title="Scores & Fixtures" />
        <section className="pb-6 pt-10 px-6 _page flex justify-center items-center min-h-100">
          <Loader message="Loading matches..." />
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <HEADER title="Scores & Fixtures" />
        <section className="pb-6 pt-10 px-6 _page">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load matches:{" "}
              {(error as any)?.message || "Unknown error"}
            </AlertDescription>
          </Alert>
        </section>
      </div>
    );
  }

  return (
    <div>
      <HEADER title="Scores & Fixtures" />
      <section className="pb-6 pt-10 px-6 _page">
        <FixturesSection fixtures={fixtures} />
      </section>
    </div>
  );
}
