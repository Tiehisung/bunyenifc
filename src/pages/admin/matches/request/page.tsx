 
import { IPageProps, IQueryResponse } from "@/types";
import { getMatches } from "../page";
import { getManagers, IManager } from "../../managers/page";
import { MatchRequestForm } from "./LetterForm";
import { auth } from "@/auth";
import { teamKFC } from "@/data/teams";
import FixtureSelector from "./FixtureSelector";

const MatchRequestPage = async ({ searchParams }: IPageProps) => {
  const session = await auth();
  const fixtureId = (await searchParams).fixtureId;
  const fixtures: IQueryResponse<IMatch[]> = await getMatches(
    "?status=UPCOMING"
  );

  const managers: IQueryResponse<IManager[]> = await getManagers(
    `?manager_search=${session?.user?.email}`
  );

  const requester =
    managers?.data?.[0] ??
    ({
      fullname: session?.user?.name,
      role: "KonFC Official",
      phone: teamKFC?.contact,
    } as IManager);

  const selectedFixture = fixtures?.data?.find((f) => f?._id == fixtureId);

  return (
    <div>
      <main className="_page py-12 space-y-10">
        {!fixtureId ? (
          <FixtureSelector fixtures={fixtures} />
        ) : (
          <MatchRequestForm
            match={selectedFixture as IMatchProps}
            official={{
              requester,
            }}
          />
        )}
      </main>
    </div>
  );
};

export default MatchRequestPage;
