import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EPlayerPosition, IPlayer } from "@/types/player.interface";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PrimarySelect } from "@/components/select/Select";
import { Button } from "@/components/buttons/Button";
import { IStaff } from "@/types/staff.interface";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { TextArea } from "@/components/input/Inputs";
import { Label } from "@/components/ui/label";

import { formatDate, getTimeLeftOrAgo } from "@/lib/timeAndDate";
import { enumToOptions } from "@/lib/select";
import { IMatch } from "@/types/match.interface";
import { useCreateSquadMutation } from "@/services/squad.endpoints";
import { ISquad } from "@/types/squad.interface";
import { smartToast } from "@/utils/toast";

interface IProps {
  players?: IPlayer[];
  staff?: IStaff[];
  matches?: IMatch[];
  defaultMatch?: IMatch;
}

// Zod Validation Schema
const squadSchema = z.object({
  match: z.any(),
  description: z.string().max(500).optional(),
  selectedPlayers: z
    .record(z.string(), z.boolean())
    .refine((players) => Object.values(players).filter(Boolean).length >= 11, {
      message: "Select at least 11 players",
    }),
  positions: z.record(z.string(), z.enum(EPlayerPosition).optional()),
  coach: z.string().min(1, "Coach is required"),
  assistant: z.string().min(1, "Assistant is required"),
});

export type IPostSquad = z.infer<typeof squadSchema>;

const SquadForm = ({
  defaultMatch,
  players = [],
  staff = [],
  matches = [],
}: IProps) => {
  const [createSquad, { isLoading: isCreating }] = useCreateSquadMutation();

  const { handleSubmit, control, setValue, watch, reset } = useForm<IPostSquad>(
    {
      resolver: zodResolver(squadSchema),
      defaultValues: {
        selectedPlayers: {},
        positions: {},
        match: defaultMatch,
        coach: "",
        assistant: "",
        description: "",
      },
    },
  );

  const selectedPlayers = watch("selectedPlayers");
  const positions = watch("positions");
  const selectedMatch = watch("match");

  // Auto-set positions from player data on mount
  useEffect(() => {
    if (players.length > 0) {
      // Create positions object from player data
      const initialPositions = players.reduce(
        (acc, player) => {
          if (player.position) {
            acc[player._id] = player.position;
          }
          return acc;
        },
        {} as Record<string, EPlayerPosition>,
      );

      // Set all positions at once
      setValue("positions", initialPositions);
    }
  }, [players, setValue]);

  // Optional: Auto-select players based on some criteria (e.g., available players)
  useEffect(() => {
    if (players.length > 0) {
      // Example: Auto-select first 11 players (or based on your logic)
      const initialSelection = players.slice(0, 11).reduce(
        (acc, player) => {
          acc[player._id] = true;
          return acc;
        },
        {} as Record<string, boolean>,
      );

      setValue("selectedPlayers", initialSelection);
    }
  }, [players, setValue]);

  const onSubmit = async (data: IPostSquad) => {
    try {
      const selectedCount = Object.values(data.selectedPlayers || {}).filter(
        Boolean,
      ).length;

      if (selectedCount < 11) {
        smartToast({
          success: false,
          message: `Please select at least 11 players for the squad. Currently selected: ${selectedCount}`,
        });
        return;
      }

      const coachObj = staff?.find((m) => m._id === data.coach);
      const assistantObj = staff?.find((m) => m._id === data.assistant);

      const payload: ISquad = {
        description: data.description,
        coach: coachObj
          ? {
              name: coachObj.fullname,
              _id: coachObj._id,
              avatar: coachObj.avatar,
            }
          : undefined,
        assistant: assistantObj
          ? {
              name: assistantObj.fullname,
              _id: assistantObj._id,
              avatar: assistantObj.avatar,
            }
          : undefined,
        players: players
          .filter((p) => data.selectedPlayers[p._id])
          .map((p) => ({
            _id: p._id,
            name: `${p.firstName} ${p.lastName}`,
            position: data.positions[p._id] || p.position,
            avatar: p.avatar,
          })),
        match: data.match as IMatch,
      };

      const result = await createSquad(payload).unwrap();

      if (result.success) {
        reset({
          selectedPlayers: {},
          positions: {},
          description: "",
          match: undefined,
          coach: "",
          assistant: "",
        });
      }
      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grow space-y-4">
      <Card className="border-0">
        <CardHeader>
          <CardTitle className="text-xl font-black">NEW MATCH SQUAD</CardTitle>
          <CardDescription className="flex gap-4 justify-between items-center flex-wrap border-b pb-5">
            {/* Opponent Select */}
            <div className="w-full sm:w-auto">
              <Label className="mb-2">MATCH</Label>
              <Controller
                name="match"
                control={control}
                render={({ field, fieldState }) => (
                  <PrimarySelect
                    options={matches.map((f) => ({
                      label: `${f.title}`,
                      value: f._id,
                    }))}
                    placeholder="Match"
                    value={field?.value?._id as string}
                    onChange={(v) =>
                      field.onChange(matches.find((f) => f._id === v))
                    }
                    error={fieldState?.error?.message}
                    disabled={!!defaultMatch}
                  />
                )}
              />
            </div>

            {/* Venue Select */}
            <div className="w-full sm:w-auto">
              <Label className="mb-2">VENUE</Label>
              <div>{selectedMatch?.isHome ? "Home" : "Away"}</div>
            </div>
            <div className="w-full sm:w-auto">
              <Label className="mb-2">DATE</Label>
              <div>
                {formatDate(selectedMatch?.date, "March 2, 2025")}(
                {getTimeLeftOrAgo(selectedMatch?.date).formatted})
              </div>
            </div>

            <div className="w-full sm:w-auto">
              <Label className="mb-2">TIME</Label>
              <div>{selectedMatch?.time}</div>
            </div>

            {/* Match Description */}
            <div className="w-full">
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <TextArea
                    {...field}
                    error={fieldState?.error?.message}
                    placeholder="Description"
                    dataTip="Description of this match event"
                  />
                )}
              />
            </div>
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Players Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border font-semibold">
                  <th className="text-left py-3 px-4">PLAYER</th>
                  <th className="text-left py-3 px-4">POSITION</th>
                </tr>
              </thead>

              <tbody>
                {players.map((player) => {
                  const isSelected = selectedPlayers[player._id];

                  return (
                    <tr
                      key={player._id}
                      className={`border-b border-border transition-colors ${
                        isSelected ? "bg-popover" : ""
                      }`}
                    >
                      <td className="py-3 px-4 font-semibold uppercase">
                        <Button
                          type="button"
                          onClick={() =>
                            setValue(
                              `selectedPlayers.${player._id}`,
                              !isSelected,
                            )
                          }
                          className="hover:opacity-90 rounded-none"
                          variant="ghost"
                        >
                          {isSelected ? (
                            <MdCheckBox
                              size={24}
                              className="text-Green min-h-5 min-w-5"
                            />
                          ) : (
                            <MdCheckBoxOutlineBlank
                              size={24}
                              className="text-muted-foreground min-h-5 min-w-5"
                            />
                          )}
                          {`${player.lastName} ${player.firstName}`}
                          <span>({player?.number})</span>
                        </Button>
                      </td>

                      <td className="text-center py-3 px-4">
                        <PrimarySelect
                          options={enumToOptions(EPlayerPosition)}
                          placeholder="Position"
                          triggerStyles="border border-border rounded font-semibold capitalize"
                          className="capitalize"
                          onChange={(val) =>
                            setValue(
                              `positions.${player._id}`,
                              val as EPlayerPosition,
                            )
                          }
                          disabled={!selectedPlayers[player._id]}
                          value={positions[player._id] || player?.position}
                          required={!!selectedPlayers[player._id]}
                          name={`pos-${player._id}`}
                          error={
                            isSelected && !positions[player._id]
                              ? "Required"
                              : ""
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Coach Selection */}
          <div className="mt-10">
            <h1 className="font-semibold mb-2">Technical Leadership</h1>

            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-border">
                  <TableHead>Coach</TableHead>
                  <TableHead>Assistant</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow>
                  <TableCell>
                    <Controller
                      name="coach"
                      control={control}
                      render={({ field, fieldState }) => (
                        <PrimarySelect
                          options={staff?.map((m) => ({
                            label: m.fullname,
                            value: m._id,
                          }))}
                          placeholder="Coach"
                          value={field.value}
                          onChange={field.onChange}
                          error={fieldState?.error?.message}
                          name="coach"
                        />
                      )}
                    />
                  </TableCell>

                  <TableCell>
                    <Controller
                      name="assistant"
                      control={control}
                      render={({ field, fieldState }) => (
                        <PrimarySelect
                          options={staff?.map((m) => ({
                            label: m.fullname,
                            value: m._id,
                          }))}
                          placeholder="Assistant"
                          value={field.value}
                          onChange={field.onChange}
                          error={fieldState?.error?.message}
                          name="assistant"
                        />
                      )}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 text-right">
            <Button
              type="submit"
              primaryText="Save Squad"
              waiting={isCreating}
              className="_primaryBtn p-3"
            />
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default SquadForm;
