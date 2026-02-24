import { ConfirmDialog } from "@/components/Confirm-dialog";
import { shortText } from "@/lib";
import { EMatchStatus, IMatch, ITeam } from "@/types/match.interface";
import { UpdateFixtureMatch } from "../CreateFixture";
import { DIALOG } from "@/components/Dialog";
import SquadCard from "../../squad/SquadCard";
import SquadForm from "../../squad/SquadForm";
import { IPlayer } from "@/types/player.interface";
import {
  useUpdateMatchMutation,
  useDeleteMatchMutation,
} from "@/services/match.endpoints";

import { smartToast } from "@/utils/toast";
import { useGetStaffMembersQuery } from "@/services/staff.endpoints";

const MatchActions = ({
  match,
  matches,
  teams,
  players,
}: {
  match: IMatch;
  matches?: IMatch[];
  teams: ITeam[];
  players?: IPlayer[];
}) => {
  const status = match?.status;
  const [updateMatch] = useUpdateMatchMutation();
  const [deleteMatch] = useDeleteMatchMutation();

  const { data: staffData } = useGetStaffMembersQuery('');
 

  const handleStatusUpdate = async (newStatus: "LIVE" | "FT") => {
    try {
      const result = await updateMatch({
        _id: match._id,
        status: newStatus as EMatchStatus,
      }).unwrap();

      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };

  const handleDelete = async () => {
    try {
      const result = await deleteMatch(match._id).unwrap();
      if (result.success) window.location.href = "/admin/matches";
      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };

  return (
    <div>
      <h1>Match Actions</h1>

      <div className="flex items-center gap-5 flex-wrap border-b py-4 mb-4">
        <UpdateFixtureMatch teams={teams} fixture={match} />

        {match?.squad ? (
          <DIALOG
            trigger="Squad"
            title=""
            className="min-w-[80vw]"
            variant="outline"
          >
            <SquadCard squad={match?.squad} match={match} />
          </DIALOG>
        ) : (
          <DIALOG
            trigger="Choose Squad"
            variant="ghost"
            size="sm"
            title={`Select Squad for ${match?.title}`}
            className="min-w-[80vw]"
          >
            <SquadForm
              players={players}
              staff={staffData?.data}
              matches={matches}
              defaultMatch={match}
            />
          </DIALOG>
        )}

        {status === "UPCOMING" && (
          <ConfirmDialog
            description={`Are you sure you want this match to go live? \n <i>${
              match?.title ?? ""
            }</i>`}
            onConfirm={() => handleStatusUpdate("LIVE")}
            trigger="Go Live"
            triggerStyles="text-sm p-1.5 px-2 justify-start"
            variant="destructive"
            title={`Start ${match?.title}`}
          />
        )}

        {status === "LIVE" && (
          <ConfirmDialog
            description={`Do you want to finish this match? \n <i>${
              match?.title ?? ""
            }</i>`}
            onConfirm={() => handleStatusUpdate("FT")}
            trigger="End Live"
            triggerStyles="text-sm p-1.5 px-2 justify-start"
            variant="destructive"
            title={`End | ${match?.title}`}
          />
        )}

        <ConfirmDialog
          trigger="Delete"
          onConfirm={handleDelete}
          variant="destructive"
          title={shortText(match?.title ?? "Match")}
          description={`Are you sure you want to delete "<b>${shortText(
            match?.title ?? "Match",
            40,
          )}</b>"?`}
        />
      </div>
    </div>
  );
};

export default MatchActions;
