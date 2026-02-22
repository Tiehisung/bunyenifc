 

import { Button } from "@/components/buttons/Button";
import { DIALOG } from "@/components/Dialog";
import _players from "@/data/players";
import   { useState } from "react";
import Select from "react-select";

const HomeTeamGoalForm = ({}) => {
 

  const onfieldPlayers = _players.map((p) => ({
    label: `${p.lastName} ${p.firstName}`,
    value: p._id,
  }));
  return (
    <DIALOG trigger="Goal" title={undefined}  >
      <form className="">
        <div>
          <p className="_label">Player</p>
          <Select
            options={onfieldPlayers}
            onChange={(arg) => console.log(arg?.value )}
          />
        </div>
        <div>
          <p className="_label">Time</p>
          <input
            type="number"
            name="time"
            max={100}
            min={1}
            className="bg-white text-black p-2 w-20"
            required
          />
        </div>
        <div>
          <Button
            type="submit"
            waitingText={"Saving..."}
            primaryText={"Save Goal"}
            className="_secondaryBtn px-3 mt-2"
          />
        </div>
      </form>
    </DIALOG>
  );
};

export default HomeTeamGoalForm;

export const AwayTeamGoalForm = ({}) => {
  const [waiting, setWaiting] = useState(false);
  console.log(setWaiting);

  return (
    <DIALOG trigger="Goal" title={undefined}>
      <form className="">
        <div>
          <p className="_label">Time</p>
          <input
            type="number"
            name="time"
            max={100}
            min={1}
            className="bg-white text-black p-2 w-20"
            required
          />
        </div>
        <div>
          <Button
            type="submit"
            waiting={waiting}
            disabled={waiting}
            waitingText={"Saving..."}
            primaryText={"Save Goal"}
            className="_secondaryBtn px-3 mt-2"
          />
        </div>
      </form>
    </DIALOG>
  );
};

export const GoalForms = () => {
  return (
    <div className="flex w-full h-fit border rounded-mx p-3">
      <HomeTeamGoalForm />
      <AwayTeamGoalForm />
    </div>
  );
};
