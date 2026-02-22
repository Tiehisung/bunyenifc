import { ConfirmActionButton } from "@/components/buttons/ConfirmAction";
import { AVATAR } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { shortText } from "@/lib";
import { checkMatchMetrics, checkTeams } from "@/lib/compute/match";
import {
  formatDate,
  formatTimeToAmPm,
  getTimeLeftOrAgo,
} from "@/lib/timeAndDate";
import { ToggleMatchStatus } from "./DisplayFixtures";
import { DIALOG } from "@/components/Dialog";
import SquadCard from "../squad/SquadCard";
import { UpdateFixtureMatch } from "./CreateFixture";
import SquadForm from "../squad/SquadForm";
import { IPlayer } from "@/types/player.interface";
import { IManager } from "../managers/page";
import { IMatch, ITeam } from "@/types/match.interface";
import { ResizableContent } from "@/components/resizables/ResizableContent";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error";
import { useDeleteMatchMutation } from "@/services/match.endpoints";

export function AdminMatchCard({
  match,
  teams,
  managers,
  matches,
  players,
}: {
  match?: IMatch;
  teams?: ITeam[];
  players?: IPlayer[];
  managers?: IManager[];
  matches?: IMatch[];
}) {
  const { away, home } = checkTeams(match);
  const scores = checkMatchMetrics(match);
  const status = match?.status;

  const [deleteMatch, { isLoading: isDeleting }] = useDeleteMatchMutation();

  const handleDelete = async () => {
    if (!match?._id) return;
    try {
      const result = await deleteMatch(match._id).unwrap();
      if (result.success) {
        toast.success("Match deleted successfully");
      } else {
        toast.error(result.message || "Failed to delete match");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="bg-card border p-4 space-y-2.5 max-w-[90vw]">
      <header className="flex justify-between gap-5">
        <Badge
          variant={
            status === "LIVE"
              ? "destructive"
              : status === "FT"
                ? "secondary"
                : "outline"
          }
        >
          {status}
        </Badge>
        <div className="text-sm text-muted-foreground">
          {formatDate(match?.date, "March 2, 2025")}(
          {getTimeLeftOrAgo(match?.date).formatted})
        </div>
      </header>

      <main className="flex items-center justify-between">
        <ul>
          <li className="flex items-center gap-1.5 mb-2">
            <AVATAR
              src={home?.logo as string}
              alt={home?.name as string}
              className="h-7 w-7 aspect-square rounded-none"
            />
            <span className="line-clamp-1">{home?.name}</span>
          </li>
          <li className="flex items-center gap-1.5">
            <AVATAR
              src={away?.logo as string}
              alt={away?.name as string}
              className="h-7 w-7 aspect-square rounded-none"
            />
            <span className="line-clamp-1">{away?.name}</span>
          </li>
        </ul>

        <div className="font-semibold">
          {status === "FT" ? (
            <div className="grid">
              <span className="px-3 text-lg">{scores?.goals?.home}</span>
              <span className="px-3 text-lg">{scores?.goals?.away}</span>
            </div>
          ) : status === "LIVE" ? (
            <span className="text-destructive">Live</span>
          ) : (
            <span>{formatTimeToAmPm(match?.time as string)}</span>
          )}
        </div>
      </main>

      <hr />

      <ResizableContent className="">
        <UpdateFixtureMatch teams={teams} fixture={match} />

        <ToggleMatchStatus
          fixtureId={match?._id as string}
          matchDate={match?.date as string}
          status={match?.status as IMatch["status"]}
        />

        {match?.squad ? (
          <DIALOG
            trigger="Squad"
            triggerStyles="justify-start"
            title=""
            className="min-w-[80vw]"
          >
            <SquadCard squad={match?.squad} match={match} />
          </DIALOG>
        ) : (
          <DIALOG
            trigger="Choose Squad"
            variant="ghost"
            triggerStyles="justify-start"
            title={`Select Squad for ${match?.title}`}
            className="min-w-[80vw]"
          >
            <SquadForm
              players={players}
              managers={managers}
              matches={matches}
              defaultMatch={match}
            />
          </DIALOG>
        )}

        <Link
          to={`/admin/matches/${match?.slug ?? match?._id}`}
          className="_hover _link p-2 px-4"
        >
          View
        </Link>

        <ConfirmActionButton
          primaryText="Delete"
          trigger="Delete"
          triggerStyles="justify-start"
          onConfirm={handleDelete}
          isLoading={isDeleting}
          variant="destructive"
          confirmVariant="delete"
          title={shortText(match?.title ?? "Match")}
          confirmText={`Are you sure you want to delete "<b>${shortText(
            match?.title ?? "Match",
            40,
          )}</b>"?`}
          escapeOnEnd
        />
      </ResizableContent>
    </div>
  );
}
