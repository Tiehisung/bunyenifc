import InfiniteLimitScroller from "@/components/InfiniteScroll";
import { SearchHighlights } from "../admin/media/highlights/Search";
import { MatchHighlights } from "../admin/media/highlights/DisplayHighlights";
import { useSearchParams } from "react-router-dom";
import { useGetHighlightsQuery } from "@/services/highlights.endpoints";
import { useGetMatchesQuery } from "@/services/match.endpoints";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import TableLoader from "@/components/loaders/Table";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MatchHighlightsPage() {
  const [searchParams] = useSearchParams();
  const paramsString = searchParams.toString();

  const {
    data: highlights,
    isLoading: highlightsLoading,
    error: highlightsError,
  } = useGetHighlightsQuery(paramsString);

  const { data: matches, isLoading: matchesLoading } = useGetMatchesQuery({});

  const isLoading = highlightsLoading || matchesLoading;
  const ismobile = useIsMobile();
  if (isLoading) {
    return (
      <div className="_page min-h-96 pt-24 flex justify-center items-center">
        <TableLoader
          className="h-24 rounded-2xl"
          cols={ismobile ? 1 : 3}
          rows={ismobile ? 2 : 3}
        />
      </div>
    );
  }

  if (highlightsError) {
    return (
      <div className="_page min-h-96 pt-24">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load highlights:{" "}
            {(highlightsError as any)?.message || "Unknown error"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="_page min-h-96 pt-24">
      <h1 className="_title ">Match Highlights</h1>
      <SearchHighlights matches={matches?.data} />
      <MatchHighlights highlights={highlights} />
      <InfiniteLimitScroller
        pagination={highlights?.pagination}
        endDataText="The End"
      />
    </div>
  );
}
