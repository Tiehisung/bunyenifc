import { ConfirmDialog } from "@/components/Confirm-dialog";
import { shortText } from "@/lib";
import { apiConfig } from "@/lib/configs";
import { IMatch, ITeam } from "@/types/match.interface";
import { UpdateFixtureMatch } from "../CreateFixture";
import { DIALOG } from "@/components/Dialog";
import SquadCard from "../../squad/SquadCard";
import SquadForm from "../../squad/SquadForm";
import { IQueryResponse } from "@/types";
import { getManagers, IManager } from "../../managers/page";
import { IPlayer } from "@/types/player.interface";
import { ConfirmActionButton } from "@/components/buttons/ConfirmAction";

const MatchActions = async ({
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

  const managers: IQueryResponse<IManager[]> = await getManagers();
  return (
    <div>
      <h1>Match Actions</h1>

      <div className="flex items-center gap-5 flex-wrap border-b py-4 mb-4">
        <UpdateFixtureMatch teams={teams} fixture={match} />

        {match?.squad ? (
          <DIALOG
            trigger={"Squad"}
            title=""
            className="min-w-[80vw]"
            variant="outline"
          >
            <SquadCard squad={match?.squad} match={match} />
          </DIALOG>
        ) : (
          <DIALOG
            trigger={"Choose Squad"}
            variant={"ghost"}
            size={"sm"}
            title={`Select Squad for ${match?.title}`}
            className="min-w-[80vw]"
          >
            <SquadForm
              players={players}
              managers={managers?.data}
              matches={matches}
              defaultMatch={match}
            />
          </DIALOG>
        )}

        {status == "UPCOMING" && (
          <ConfirmDialog
            description={`Are you sure you want this match to go live? \n <i>${
              match?.title ?? ""
            }</i>`}
            action={{
              method: "PUT",
              uri: `${apiConfig.matches}/${match._id}`,
              body: { status: "LIVE" },
            }}
            trigger="Go Live"
            triggerStyles="text-sm p-1.5 px-2 justify-start"
            variant={"delete"}
            title={`Start ${match?.title}`}
          />
        )}

        {status == "LIVE" && (
          <ConfirmDialog
            description={`Do you want to finish this match? \n <i>${
              match?.title ?? ""
            }</i>`}
            action={{
              method: "PUT",
              uri: `${apiConfig.matches}/${match._id}`,
              body: { status: "FT" },
            }}
            trigger="End Live"
            triggerStyles="text-sm p-1.5 px-2 justify-start"
            variant={"delete"}
            title={`End | ${match?.title}`}
          />
        )}
        <ConfirmDialog
          trigger={" Delete"}
          action={{
            method: "DELETE",
            uri: `${apiConfig.matches}/${match._id}`,
            goBackAfter:true
          }}
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
