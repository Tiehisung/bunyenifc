import { FormEvent, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/input/Inputs";

import { IPlayer } from "@/types/player.interface";
import { Button } from "@/components/buttons/Button";

import { IGoal, IMatch, ITeam } from "@/types/match.interface";
import { SWITCH } from "@/components/ui/switch";
import { PrimaryCollapsible } from "@/components/Collapsible";

import {
  useCreateGoalMutation,
  useDeleteGoalMutation,
} from "@/services/goals.endpoints";
import { smartToast } from "@/utils/toast";

interface ScoreEventsTabProps {
  players: IPlayer[];
  opponent?: ITeam;
  match: IMatch;
}

export function ScoreEventsTab({ players, match }: ScoreEventsTabProps) {
  const [addGoal, { isLoading }] = useCreateGoalMutation();
  const [form, setForm] = useState({
    scorer: "",
    assist: "",
    minute: "",
    description: "",
    forKFC: true,
  });

  const handleAddGoal = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      if (!form.minute)
        return smartToast({
          message: "Please specify the time in minutes, and description",
        });

      const scorer = players.find((p) => p._id === form.scorer);
      const assistBy = form.assist
        ? players.find((p) => p._id === form.assist)
        : undefined;

      const assist = assistBy
        ? {
            _id: assistBy?._id,
            name: [assistBy?.lastName, assistBy?.firstName]
              .filter(Boolean)
              .join(" "),
            avatar: assistBy?.avatar,
            number: assistBy?.number,
          }
        : undefined;

      let newGoal: any = {
        minute: Number.parseInt(form.minute),
        description: `⚽ ${form.description}`,
        modeOfScore: "Open Play Goal",
        match: match?._id,
      };

      if (form.forKFC)
        newGoal = {
          ...newGoal,
          scorer: {
            _id: scorer?._id,
            name: `${scorer?.lastName} ${scorer?.firstName}`,
            avatar: scorer?.avatar,
            number: scorer?.number,
          },
          assist,
          forKFC: true,
        };

      const results = await addGoal(newGoal).unwrap();

      // onAddGoal(newGoal);

      if (results.success)
        setForm({
          scorer: "",
          assist: "",
          minute: "",
          description: "",
          forKFC: true,
        });
      smartToast(results);
    } catch (error) {
      smartToast({ error });
    }
  };

  return (
    <div className="space-y-8">
      <Card
        className={`p-6 rounded-none ${isLoading ? "pointer-events-none" : ""}`}
      >
        <form onSubmit={handleAddGoal}>
          <h2 className="mb-6 text-2xl font-bold flex items-center gap-6 justify-between border-b">
            Add Goal{" "}
            <SWITCH
              label="For KFC"
              name="forkfc"
              onCheckedChange={(ch) => setForm((p) => ({ ...p, forKFC: ch }))}
              checked={form.forKFC}
              className=""
            />
          </h2>

          <div className="space-y-4">
            {form.forKFC && (
              <div className="grid grid-cols-1 gap-4 ">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Scorer
                  </label>
                  <Select
                    value={form.scorer}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, scorer: value }))
                    }
                  >
                    <SelectTrigger className="grow w-full ">
                      <SelectValue placeholder="Select scorer" />
                    </SelectTrigger>
                    <SelectContent>
                      {players?.map((player) => (
                        <SelectItem key={player._id} value={player._id}>
                          {`${player?.number ?? player?.number} - ${
                            player.lastName
                          } ${player?.firstName}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Assist (Optional)
                  </label>
                  <Select
                    value={form.assist}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, assist: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select assist player" />
                    </SelectTrigger>
                    <SelectContent>
                      {players?.map((player) => (
                        <SelectItem key={player._id} value={player._id}>
                          {`${player?.number ?? player?.number} - ${
                            player.lastName
                          } ${player?.firstName}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Minute</label>
                <Input
                  type="number"
                  others={{ min: "0", max: "120" }}
                  placeholder="e.g., 45"
                  value={form.minute}
                  required
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, minute: e.target.value }))
                  }
                  name={"goalMinute"}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>
                <Input
                  placeholder="e.g., VAR Review, Penalty Decision, etc."
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  name={"goalDescription"}
                />
              </div>
            </div>

            <div className="gap-6 flex items-center mt-8">
              <Button
                className="  justify-center _primaryBtn grow"
                waiting={isLoading}
                primaryText=" Add Goal"
                waitingText="Adding Goal"
                type="submit"
              >
                <Plus className="mr-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>

        {/* Goals */}
        <PrimaryCollapsible
          header={{
            label: "All Goals",
            className: "_label",
          }}
          defaultOpen
        >
          <div
            className={
              "flex items-center gap-5 flex-wrap" +
              (isLoading ? "opacity-70 pointer-events-none cursor-wait" : "")
            }
          >
            {match?.goals?.map((goal) => (
              <Goal goal={goal} key={goal._id} />
            ))}
          </div>
        </PrimaryCollapsible>
      </Card>
    </div>
  );
}

function Goal({ goal }: { goal: IGoal }) {
  const [deleteGoal, { isLoading }] = useDeleteGoalMutation();

  //Increment Opponent goals
  const handleRemoveGoal = async (goal: IGoal) => {
    try {
      const result = await deleteGoal(goal?._id as string).unwrap();

      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };
  return (
    <div
      className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg"
      key={goal._id}
    >
      {`${goal.minute}' ${goal.scorer?.name ?? " Opponent"}`}{" "}
      <Button
        onClick={() => handleRemoveGoal(goal)}
        size="sm"
        variant={"ghost"}
        waiting={isLoading}
        waitingText={"Deleting..."}
      >
        <X />
      </Button>
    </div>
  );
}
