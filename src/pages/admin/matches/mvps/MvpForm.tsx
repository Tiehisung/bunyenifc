import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/buttons/Button";
import { AVATAR } from "@/components/ui/avatar";
import SELECT, { PrimarySelect } from "@/components/select/Select";
import { TextArea } from "@/components/input/Inputs";
import { EPlayerPosition, IPlayer } from "@/types/player.interface";
import { EMatchStatus, IMatch } from "@/types/match.interface";
import { z } from "zod";
import { fireEscape } from "@/hooks/Esc";
import { enumToOptions } from "@/lib/select";
import { IMVP } from "@/types/mvp.interface";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "@/lib/error";
import { useGetMatchesQuery } from "@/services/match.endpoints";
import {
  useCreateMvpMutation,
  useUpdateMvpMutation,
} from "@/services/mvps.endpoints";
import { useGetPlayersQuery } from "@/services/player.endpoints";
import { IQueryResponse } from "@/types";

const mvpSchema = z.object({
  player: z.string().min(1, "Player is required"),
  description: z.string().optional(),
  positionPlayed: z.enum(EPlayerPosition),
  match: z.string().optional(),
});

type MvpFormValues = z.infer<typeof mvpSchema>;

interface IProps {
  player?: IPlayer;
  match?: IMatch;
  mvp?: IMVP;
}

export function MVPForm({
  match: defaultMatch,
  mvp: defaultMVP,
  player: defaultPlayer,
}: IProps) {
  const navigate = useNavigate();

 
  // Fetch players
  const { data: playersData, isLoading: isLoadingPlayers } =
    useGetPlayersQuery('');
  const players = playersData?.data || [];

  // Fetch matches
  const { data: matchesData, isLoading: isLoadingMatches } = useGetMatchesQuery(
    { status: EMatchStatus.UPCOMING },
  );
  const matches = matchesData?.data || [];

  // Mutations
  const [createMvp, { isLoading: isCreating }] = useCreateMvpMutation();
  const [updateMvp, { isLoading: isUpdating }] = useUpdateMvpMutation();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<MvpFormValues>({
    resolver: zodResolver(mvpSchema),
    defaultValues: defaultMVP
      ? ({
          ...defaultMVP,
          player:
            typeof defaultMVP?.player === "object"
              ? defaultMVP?.player?._id
              : defaultMVP?.player,
          match:
            typeof defaultMVP?.match === "object"
              ? defaultMVP.match?._id
              : defaultMVP?.match,
        } as MvpFormValues)
      : {
          player: defaultPlayer?._id,
          match: defaultMatch?._id,
          description: "",
          positionPlayed: defaultPlayer?.position,
        },
  });

  const selectedPlayerId = watch("player");
  const selectedPlayer = players?.find((p) => p._id === selectedPlayerId);

  const onSubmit = async (data: MvpFormValues) => {
    try {
      const player = players?.find((p) => p._id === data.player);
      if (!player) return;

      const _match = defaultMatch ?? matches?.find((m) => m._id == data?.match);

      const payload = {
        ...data,
        player: {
          _id: player._id,
          name: `${player.firstName} ${player.lastName}`,
          avatar: player.avatar,
          number: player.number,
        },
        description: `${data.description}`,
        positionPlayed: data.positionPlayed,
        match: _match,
        date: _match?.date,
      };

      let response: IQueryResponse<IMVP>;
      if (defaultMVP) {
        response = await updateMvp({
          _id: defaultMVP._id,
          ...payload,
        }).unwrap();
      } else {
        response = await createMvp(payload).unwrap();
      }

      toast.success(response.message, { position: "bottom-center" });

      if (response.success) {
        reset({
          player: "",
          description: "",
          positionPlayed: defaultPlayer?.position,
          match: defaultMatch?._id,
        });

        fireEscape();
        navigate(0);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <Card className="p-6 rounded-none">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="mb-6 text-2xl font-bold flex items-center justify-between">
          {defaultMVP ? `Edit - ${defaultMVP?.player?.name}` : "Add MoTM"}:
          <AVATAR
            alt="mvp player"
            src={selectedPlayer?.avatar as string}
            fallbackText="IP"
          />
        </h2>

        <div className="space-y-4">
          {/* Player */}
          {!(defaultPlayer || defaultMVP) && (
            <Controller
              control={control}
              name="player"
              render={({ field, fieldState }) => (
                <SELECT
                  {...field}
                  options={
                    players?.map((p) => ({
                      label: `${p.number} - ${p.lastName} ${p.firstName}`,
                      value: p._id,
                    })) ?? []
                  }
                  label="Player"
                  placeholder="Select"
                  selectStyles="w-full"
                  error={fieldState?.error?.message}
                  className="grid"
                  loading={isLoadingPlayers}
                />
              )}
            />
          )}

          {!(defaultMatch || defaultMVP) && (
            <Controller
              control={control}
              name="match"
              render={({ field, fieldState }) => (
                <SELECT
                  {...field}
                  options={
                    matches?.map((m) => ({
                      label: m.title,
                      value: m._id,
                    })) ?? []
                  }
                  label="Match"
                  placeholder="Select"
                  selectStyles="w-full"
                  error={fieldState?.error?.message}
                  className="grid"
                  loading={isLoadingMatches}
                />
              )}
            />
          )}

          {/* Position Played */}
          <Controller
            control={control}
            name="positionPlayed"
            render={({ field, fieldState }) => (
              <PrimarySelect
                {...field}
                options={enumToOptions(EPlayerPosition)}
                label="Position Played"
                placeholder="Select"
                triggerStyles="w-full"
                error={fieldState?.error?.message}
              />
            )}
          />

          {/* Description */}
          <Controller
            control={control}
            name="description"
            render={({ field, fieldState }) => (
              <TextArea
                {...field}
                label="Description"
                placeholder="e.g., Wrong celebration, fight..."
                error={fieldState?.error?.message}
              />
            )}
          />

          <Button
            type="submit"
            waiting={isSubmitting || isCreating || isUpdating}
            className="w-full _primaryBtn"
            primaryText={defaultMVP ? "Edit MoTM" : "Add MoTM"}
            waitingText={defaultMVP ? "Editing MoTM..." : "Adding MoTM..."}
          >
            <Plus className="mr-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
}
