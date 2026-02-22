
import { IPlayer } from "@/types/player.interface";
import { getRandomIndex } from "@/lib";

export function PlayerCard({ player }: { player: IPlayer }) {
  return (
    <div
      className={`relative overflow-hidden bg-linear-to-b text-white from-red-500 to-red-700 shadow-lg pb-2 flex flex-col justify-between`}
    >
      <div className="z-10 px-3">
        <h2 className="text-xl font-bold backdrop-blur-xs w-fit p-0 uppercase line-clamp-1">
          {player?.firstName}{" "}
          <span className="font-normal">{player?.lastName}</span>
        </h2>
        <p className="text-sm  uppercase"> {player?.position}</p>
        <h3 className="text-3xl font-extrabold my-4">
          {player?.goals?.length} Goals
        </h3>
      </div>

      <img
        width={500}
        height={500}
        src={player?.avatar}
        alt={player?.avatar}
        className="w-full h-72 md:h-64 object-cover aspect-square md:aspect-video  "
      />

      <div className="mt-6 grid grid-cols-2 gap-y-1 text-sm z-10 px-3">
        <p>
          Matches:{" "}
          <span className="font-semibold ">
            {player?.matches?.length ?? 0}
          </span>
        </p>
        <p>
          Assists:{" "}
          <span className="font-semibold ">
            {player?.assists?.length ?? 0}
          </span>
        </p>
        <p>
          Pass Acc.:{" "}
          <span className="font-semibold ">
            {player?.passAcc ?? getRandomIndex(100)}%
          </span>
        </p>
        <p>
          Trophies:{" "}
          <span className="font-semibold ">
            {player?.trophies ?? 0}
          </span>
        </p>
      </div>
    </div>
  );
}
