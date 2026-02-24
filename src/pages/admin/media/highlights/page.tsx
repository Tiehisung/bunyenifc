import { HighlightUpload } from "./Uploader";
import { MatchHighlights } from "./DisplayHighlights";
import { SearchHighlights } from "./Search";
import InfiniteLimitScroller from "@/components/InfiniteScroll";
import { useGetHighlightsQuery } from "@/services/highlights.endpoints";
import { useSearchParams } from "react-router-dom";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGetMatchesQuery } from "@/services/match.endpoints";
import PageLoader from "@/components/loaders/Page";

export default function MatchHighlightsPage() {
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString()
    ? `?${searchParams.toString()}`
    : "";

  // Fetch highlights with query params
  const {
    data: highlights,
    isLoading: highlightsLoading,
    error: highlightsError,
    isFetching: highlightsFetching,
  } = useGetHighlightsQuery(queryString);

  // Fetch matches for the uploader and search
  const { data: matches, isLoading: matchesLoading } = useGetMatchesQuery({});

  const isLoading = highlightsLoading || matchesLoading;
  const hasError = highlightsError;

  if (isLoading) {
    return (
      <div className="_page min-h-96 flex justify-center items-center">
        <PageLoader />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="_page min-h-96">
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
    <div className="_page min-h-96">
      <HighlightUpload matches={matches?.data} />

      <SearchHighlights matches={matches?.data} />

      <MatchHighlights highlights={highlights} />

      <InfiniteLimitScroller
        pagination={highlights?.pagination}
        endDataText="The End"
      />

      {highlightsFetching && (
        <div className="fixed bottom-4 right-4">
          <Loader size="sm" message="Updating..." />
        </div>
      )}
    </div>
  );
}
