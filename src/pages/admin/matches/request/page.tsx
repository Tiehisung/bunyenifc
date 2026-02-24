import { MatchRequestForm } from "./LetterForm";

import FixtureSelector from "./FixtureSelector";
import { EMatchStatus, IMatch } from "@/types/match.interface";
import { useSearchParams } from "react-router-dom";
import { useGetMatchesQuery } from "@/services/match.endpoints";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { dummyUser } from "@/data/user";
import { teamBnfc } from "@/data/teamBnfc";
import { IStaff } from "@/types/staff.interface";
import { useGetStaffMembersQuery } from "@/services/staff.endpoints";

const MatchRequestPage = () => {
  const user = dummyUser;
  const [searchParams] = useSearchParams();
  const fixtureId = searchParams.get("fixtureId");

  const { data: fixturesData, isLoading: fixturesLoading } = useGetMatchesQuery(
    { status: EMatchStatus.UPCOMING },
  );

  const { data: staffData, isLoading: staffLoading } = useGetStaffMembersQuery(
    {},
  );

  const isLoading = fixturesLoading || staffLoading;
  const fixtures = fixturesData;

  const requester =
    staffData?.data?.[0] ??
    ({
      fullname: user?.name,
      role: `${teamBnfc.name} Official`,
      phone: teamBnfc.contact,
    } as IStaff);

  const selectedFixture = fixtures?.data?.find((f) => f?._id === fixtureId);

  if (isLoading) {
    return (
      <div>
        <main className="_page py-12 space-y-10">
          <div className="flex justify-center items-center min-h-100">
            <Loader message="Loading match request data..." />
          </div>
        </main>
      </div>
    );
  }

  if (!fixtures?.data?.length) {
    return (
      <div>
        <main className="_page py-12 space-y-10">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Fixtures Available</AlertTitle>
            <AlertDescription>
              There are no upcoming fixtures at the moment.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div>
      <main className="_page py-12 space-y-10">
        {!fixtureId ? (
          <FixtureSelector fixtures={fixtures} />
        ) : (
          <MatchRequestForm
            match={selectedFixture as IMatch}
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
