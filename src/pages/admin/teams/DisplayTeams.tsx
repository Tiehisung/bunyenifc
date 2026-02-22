import { teamLogos } from "@/assets/teams/logos/team-logos";
import { formatDate } from "@/lib/timeAndDate";
import { IQueryResponse } from "@/types";
import { PrimaryDropdown } from "@/components/Dropdown";
import { DIALOG } from "@/components/Dialog";
import { LVOutPutTable } from "@/components/tables/VerticalTable";
import { Edit, Plus, Trash } from "lucide-react";
import { ConfirmDialog } from "@/components/Confirm-dialog";
import { StackModal } from "@/components/modals/StackModal";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDeleteTeamMutation } from "@/services/team.endpoints";
import { ITeam } from "@/types/match.interface";
import { TeamForm } from "./TeamForm";
import { Pagination } from "@/components/pagination/Pagination";

const DisplayTeams = ({ teams }: { teams?: IQueryResponse<ITeam[]> }) => {
  const navigate = useNavigate();
  const [deleteTeam] = useDeleteTeamMutation();

  if (!teams) return <div className="_label p-6">No teams available</div>;

  const handleDelete = async (teamId: string) => {
    try {
      const result = await deleteTeam(teamId).unwrap();
      if (result.success) {
        toast.success(result.message);
        navigate(0);
      }
    } catch (error) {
      toast.error("Failed to delete team");
    }
  };

  return (
    <div className="mx-auto">
      <header className="text-muted-foreground flex items-center justify-between gap-6">
        <span className="_heading">Teams</span>
        <StackModal
          trigger={
            <>
              <Plus />
              New
            </>
          }
          triggerStyles="justify-start"
          variant="default"
          id="new-team"
          closeOnEsc
        >
          <TeamForm />
        </StackModal>
      </header>

      <ul className="divide-y-8 divide-border space-y-14">
        {teams?.data?.map((team) => (
          <li key={team?._id} className="relative pb-6 px-4">
            <p className="_heading">{team?.name}</p>
            <div className="flex flex-wrap gap-3.5">
              <img
                src={team?.logo ?? teamLogos?.[0]?.logo}
                alt={team?.name ?? "logo"}
                className="object-cover bg-accent h-60 w-60 aspect-4/3 rounded-xl"
              />

              <div className="grow">
                <LVOutPutTable
                  body={[
                    { label: "Alias", value: team?.alias },
                    {
                      label: "Last Match",
                      value: formatDate(team?.updatedAt, "March 2, 2025"),
                    },
                    { label: "Encounters", value: "0" },
                    { label: "Wins", value: "0" },
                    { label: "Losses", value: "0" },
                    { label: "Draws", value: "0" },
                  ]}
                  trStyles="w-full"
                  valueTDStyles="w-full"
                  className="rounded-xl overflow-hidden border shadow-2xs"
                />
              </div>
            </div>
            <PrimaryDropdown triggerStyles="absolute right-4 top-1 bg-accent/40 rounded-full p-1 h-10 w-10 _hover flex items-center justify-center">
              <DIALOG
                trigger={
                  <>
                    <Edit />
                    Edit
                  </>
                }
                triggerStyles="w-full justify-start"
                variant="ghost"
              >
                <TeamForm team={team} />
              </DIALOG>
              <ConfirmDialog
                onConfirm={() => handleDelete(team._id)}
                trigger={
                  <>
                    <Trash />
                    Delete
                  </>
                }
                triggerStyles="text-sm p-1.5 px-2 grow w-full justify-start"
                variant="destructive"
                title={`Delete '${team?.name}'`}
                description={`Are you sure you want to delete "${team?.name}"?`}
              />

              
            </PrimaryDropdown>
          </li>
        ))}

        {teams?.data?.length === 0 && <li>No teams available.</li>}
      </ul>

      <Pagination pagination={teams?.pagination} />
    </div>
  );
};

export default DisplayTeams;
