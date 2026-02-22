import { getAgeFromDOB } from "@/lib/timeAndDate";
import { IQueryResponse } from "@/types";
import { IPlayer } from "@/types/player.interface";
import { Link } from "react-router-dom";

interface IProps {
  players?: IQueryResponse<IPlayer[]>;
}

export default function OurPlayers({ players }: IProps) {
  return (
    <div className="px-5 md:px-[20vw] py-6">
      <ul className="space-y-5">
        {players?.data?.map((player) => (
          <li key={player._id} className="border-b border-primary pb-6">
            <h2 className="font-bold">#{player?.number}</h2>

            <div className="text-Blue text-2xl my-4">
              <Link
                to={`/players/details?playerId=${player?._id}`}
                className="_link"
              >
                {`${player?.lastName} ${player?.firstName}`}
              </Link>
            </div>

            <h1 className="capitalize mb-3">
              Age: <strong>{getAgeFromDOB(player.dob)}</strong> | Position:{" "}
              <strong>{player.position}</strong> | Status:{" "}
              <strong>{player.status}</strong> | Height:{" "}
              <strong>{player.height} FT</strong>
            </h1>

            <div className="w-full min-w-60 min-h-80 h-auto aspect-5/3">
              <img
                alt={player?.lastName as string}
                src={
                  (player?.featureMedia?.[0]?.secure_url as string) ||
                  player?.avatar
                }
                className="w-full min-w-60 h-auto bg-cover object-cover aspect-5/3"
              />
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: (player?.description ?? player?.about) as string,
              }}
              className="mt-6"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
