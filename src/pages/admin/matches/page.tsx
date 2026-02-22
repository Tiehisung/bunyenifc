import { DisplayFixtures } from "./DisplayFixtures";
import Header from "../../../components/Element";
import { QuickLinks } from "@/components/QuickLinks/LinkOrSectionId";
import { Separator } from "@/components/ui/separator";
// import { useSearchParams } from "react-router-dom";

import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGetManagersQuery } from "@/services/manager.endpoints";
import { useGetMatchesQuery } from "@/services/match.endpoints";
import { useGetPlayersQuery } from "@/services/player.endpoints";
import { useGetTeamsQuery } from "@/services/team.endpoints";
import { IQueryResponse } from "@/types";
import { IMatch } from "@/types/match.interface";

export default function AdminFixtures() {
  // const [searchParams] = useSearchParams();
  // const paramsString = searchParams.toString();

  // Multiple queries in parallel
  const {
    data: fixtures,
    isLoading: fixturesLoading,
    error: fixturesError,
  } = useGetMatchesQuery({});

  const { data: teams, isLoading: teamsLoading } = useGetTeamsQuery({});

  const { data: players, isLoading: playersLoading } = useGetPlayersQuery('');

  const { data: managers, isLoading: managersLoading } = useGetManagersQuery({});

  const isLoading =
    fixturesLoading || teamsLoading || playersLoading || managersLoading;

  if (isLoading) {
    return (
      <section className="">
        <Header title="FIXTURES & SCORES" subtitle="Manage Fixtures" />
        <div className="_page pb-6 pt-10 flex justify-center items-center min-h-100">
          <Loader message="Loading fixtures..." />
        </div>
      </section>
    );
  }

  if (fixturesError) {
    return (
      <section className="">
        <Header title="FIXTURES & SCORES" subtitle="Manage Fixtures" />
        <div className="_page pb-6 pt-10">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load fixtures:{" "}
              {(fixturesError as any)?.message || "Unknown error"}
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  return (
    <section className="">
      <Header title="FIXTURES & SCORES" subtitle="Manage Fixtures" />
      <main className="_page pb-6 pt-10">
        <DisplayFixtures
          fixtures={fixtures as IQueryResponse<IMatch[]>}
          teams={teams?.data}
          managers={managers?.data}
          players={players?.data}
        />

        <Separator />

        <h2 className="mt-8 mb-4">Quick Links</h2>

        <QuickLinks
          links={[
            {
              title: "Match Request",
              href: "/admin/matches/request",
              description: "Generate match request letter",
            },
            {
              title: "Create Fixture",
              href: "/admin/matches/create-fixture",
              description: "Add new match fixture",
            },
          ]}
          className="my-5"
        />
      </main>
    </section>
  );
}
