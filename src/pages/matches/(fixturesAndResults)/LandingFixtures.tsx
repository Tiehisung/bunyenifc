import { MatchFixtureCard, PlayedMatchCard } from "./Cards";
import PrimLink from "@/components/Link";
import { TITLE } from "@/components/Element";
import { EMatchStatus, IMatch } from "@/types/match.interface";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGetMatchesQuery } from "@/services/match.endpoints";

const LandingFixtures = () => {
  const {
    data: completedData,
    isLoading: completedLoading,
    error: completedError,
  } = useGetMatchesQuery({ status: EMatchStatus.FT });

  const { data: upcomingData, isLoading: upcomingLoading } = useGetMatchesQuery(
    { status:   EMatchStatus.UPCOMING },
  );

  const isLoading = completedLoading || upcomingLoading;
  const completedMatches = completedData;
  const upcomingMatches = upcomingData;

  if (isLoading) {
    return (
      <div className="px-4 space-y-10 _page flex justify-center items-center min-h-100">
        <Loader message="Loading fixtures..." />
      </div>
    );
  }

  if (completedError) {
    return (
      <div className="px-4 space-y-10 _page">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load fixtures. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="px-4 space-y-10 _page">
      <section>
        <header className="flex justify-between items-center gap-6">
          <TITLE text="UPCOMING FIXTURES" />
          <PrimLink
            to="/matches#fixtures"
            text="More"
            className="_link flex items-center"
          />
        </header>

        <div className="flex flex-wrap lg:grid lg:grid-cols-3 gap-[3vw] justify-center px-2 mt-5">
          {upcomingMatches?.data?.slice(0, 3)?.map((match) => (
            <MatchFixtureCard
              match={match as IMatch}
              className="grow sm:max-w-lg"
              key={match._id}
            />
          ))}
        </div>
      </section>

      <section>
        <header className="flex justify-between items-center gap-6">
          <TITLE text="PLAYED FIXTURES" />
          <PrimLink 
            to="/matches#matches"
            text="More"
            className="_link flex items-center"
          />
        </header>
        <div className="flex flex-wrap lg:grid-cols-2 xl:grid-cols-3 gap-[3vw]">
          {completedMatches?.data?.slice(0, 3)?.map((match) => (
            <PlayedMatchCard
              key={match._id}
              match={match as IMatch}
              league="Circuit Galla"
              className="max-sm:grow"
            />
          ))}
        </div>

        {completedMatches?.data?.length === 0 && (
          <p className="_label ml-3">No matches played yet</p>
        )}
      </section>
    </div>
  );
};

export default LandingFixtures;
