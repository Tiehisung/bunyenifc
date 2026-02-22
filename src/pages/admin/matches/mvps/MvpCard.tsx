 

import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/timeAndDate";
import { Calendar, User } from "lucide-react";
import { DIALOG } from "@/components/Dialog";
import { ConfirmDialog } from "@/components/Confirm-dialog";
import {
  EPlayerPosition,
  IPlayer,
  PLAYER_POSITION_UI_MAP,
} from "@/types/player.interface";
import { POPOVER } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { MVPForm } from "./MvpForm";
import { IMVP } from "@/types/mvp.interface";

interface IProps {
  mvp: IMVP;
  selectedPlayer?: IPlayer;
}
const MvpCard = ({ mvp, selectedPlayer }: IProps) => {
  const ui = PLAYER_POSITION_UI_MAP[mvp.positionPlayed as EPlayerPosition];

  return (
    <Card className="overflow-hidden">
      <div className="px-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="font-bold text-lg mb-3">{mvp.match.title}</h1>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="uppercase">
              
                <span style={{ color: ui?.color ?? "grayText" }}>
                  {ui?.icon??''} {mvp.positionPlayed??'Unknown'}
                </span>
              </Badge>
              <span className="text-sm text-muted-foreground">
                {formatDate(mvp.createdAt)}
              </span>
            </div>

            <p className="text-muted-foreground mb-3">{mvp.description}</p>

            <div className=" flex flex-wrap items-center gap-4 text-sm">
              {!selectedPlayer && (
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                    {mvp?.player?.avatar ? (
                      <img
                        src={mvp?.player?.avatar}
                        alt={mvp?.player?.name}
                        className="h-6 w-6 rounded-full object-cover"
                        width={200}
                        height={200}
                      
                      />
                    ) : (
                      <User className="h-3 w-3" />
                    )}
                  </div>
                  <span className="font-medium">{mvp?.player?.name}</span>
                  <span className="text-muted-foreground">
                    #{mvp?.player?.number}
                  </span>
                </div>
              )}

              <div className="flex items-center text-sm gap-1 text-muted-foreground">
                <Calendar className="h-5 w-5" />
                <span>Recorded {formatDate(mvp.createdAt)}</span>
              </div>
            </div>
          </div>

          <POPOVER
            variant={"ghost"}
            className="w-fit space-y-1.5 "
            size={"icon-sm"}
            triggerClassNames="rounded-full"
          >
            <DIALOG
              trigger={"Edit"}
              variant={"ghost"}
              triggerStyles="text-sm p-1.5 px-2 grow w-full justify-start "
            >
              <MVPForm match={undefined} mvp={mvp} />
            </DIALOG>

            <ConfirmDialog
              description={`Are you sure you want to delete this MVP? \n <i>${
                mvp?.description ?? ""
              }</i>`}
              action={{
                method: "DELETE",
                uri: `/mvps/${mvp._id}`,
              }}
              trigger="Delete"
              triggerStyles="text-sm p-1.5 px-2 grow w-full justify-start"
              variant={"destructive"}
              title={`Delete MoTM for ${mvp?.match?.title}`}
            />
          </POPOVER>
        </div>
      </div>
    </Card>
  );
};

export default MvpCard;
