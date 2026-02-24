import SquadForm from "./SquadForm";
import SquadCard from "./SquadCard";
import { formatDate } from "@/lib/timeAndDate";
import { PrimarySearch } from "@/components/Search";
import HEADER from "@/components/Element";
import { PrimaryTabs } from "@/components/Tabs";
import { EMatchStatus } from "@/types/match.interface";
import { useSearchParams } from "react-router-dom";
import { useGetSquadsQuery } from "@/services/squad.endpoints";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PrimaryAccordion } from "@/components/ui/accordion";
import { useGetMatchesQuery } from "@/services/match.endpoints";
import { useGetPlayersQuery } from "@/services/player.endpoints";
import { useGetStaffMembersQuery } from "@/services/staff.endpoints";

const SquadPage = () => {
  const [searchParams] = useSearchParams();
  const paramsString = searchParams.toString();
  const targetMatchId = searchParams.get("matchId");

  const { data: playersData, isLoading: playersLoading } =
    useGetPlayersQuery(paramsString);

  const { data: managersData, isLoading: managersLoading } =
    useGetStaffMembersQuery('');

  const { data: matchesData, isLoading: matchesLoading } = useGetMatchesQuery({
    status: EMatchStatus.UPCOMING,
  });

  const {
    data: squadsData,
    isLoading: squadsLoading,
    error: squadsError,
  } = useGetSquadsQuery(paramsString);

  const isLoading =
    playersLoading || managersLoading || matchesLoading || squadsLoading;
  const players = playersData;
  const managers = managersData;
  console.log(managers);
  const matches = matchesData;
  const squads = squadsData;

  const targetMatch = matches?.data?.find((m) => m._id === targetMatchId);

  const accordion = squads?.data?.map((squad) => ({
    trigger: (
      <div className="flex items-center gap-1 justify-between">
        <span>{squad?.title}</span>
        <span className="_label">
          {squad.match?.isHome ? " Home" : " Away"}
        </span>
        {" - "}
        <span>
          {formatDate(squad.match?.date, "March 2, 2025")}, {squad.match?.time}
        </span>
      </div>
    ),
    content: <SquadCard squad={squad} />,
    value: squad._id ?? "",
  }));

  if (isLoading) {
    return (
      <div className="px-4">
        <HEADER title="SQUAD" />
        <main className="_page px-3 mt-6 flex justify-center items-center min-h-100">
          <Loader message="Loading squads..." />
        </main>
      </div>
    );
  }

  if (squadsError) {
    return (
      <div className="px-4">
        <HEADER title="SQUAD" />
        <main className="_page px-3 mt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load squads:{" "}
              {(squadsError as any)?.message || "Unknown error"}
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div className="px-4">
      <HEADER title="SQUAD" />
      <main className="_page px-3 mt-6">
        <PrimaryTabs
          tabs={[
            { label: "New Squad", value: "new-squad" },
            { label: "All Squads", value: "all-squads" },
          ]}
          defaultValue="new-squad"
          className=""
        >
          <section>
            <SquadForm
              players={players?.data}
              staff={[]} //managers?.data??
              matches={matches?.data}
              defaultMatch={targetMatch}
            />
          </section>

          <section className="mt-12 space-y-6">
            <PrimarySearch
              className="bg-popover"
              inputStyles="h-9"
              placeholder="Search Squad"
              searchKey="squad_search"
            />
            <PrimaryAccordion
              data={accordion ?? []}
              className=""
              triggerStyles="cursor-pointer _card"
            />
          </section>
        </PrimaryTabs>
      </main>
    </div>
  );
};

export default SquadPage;
