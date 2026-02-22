import { ITeamProps } from "@/app/matches/(fixturesAndResults)";
import { IQueryResponse } from "@/types";
import { getTeams } from "../../teams/page";
import CreateMatch from "../CreateFixture";
const NewFixturePage = async () => {
  const teams: IQueryResponse<ITeamProps[]> = await getTeams();
  return (
    <div className="_page py-14">
      <div className=" ">
        <h1 className="_title">CREATE FIXTURE</h1>
        <CreateMatch teams={teams?.data} />
      </div>
    </div>
  );
};

export default NewFixturePage;
