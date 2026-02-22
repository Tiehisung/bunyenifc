import { PrimaryCollapsible } from "@/components/Collapsible";
import { CgPerformance } from "react-icons/cg";

import { IQueryResponse } from "@/types";
import { IPlayersStats } from "@/types/stats";

export default function TopPlayers() {
  const playersStats: IQueryResponse<IPlayersStats> = {
    data: exampleStats,
    success: true,
  };

  return (
    <PrimaryCollapsible
      header={{
        icon: <CgPerformance size={20} />,
        label: <div className="text-xl font-black">TOP PERFORMERS</div>,
        className: "ring grow",
      }}
    >
      <p className="_p">Leading scorers and playmakers this season</p>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-black text-foreground">
                Player
              </th>
              <th className="text-center py-3 px-4 font-black text-foreground">
                Goals
              </th>
              <th className="text-center py-3 px-4 font-black text-foreground">
                Assists
              </th>
              <th className="text-center py-3 px-4 font-black text-foreground">
                Matches
              </th>
            </tr>
          </thead>
          <tbody>
            {playersStats?.data?.topPerformers?.map((player, i) => (
              <tr
                key={i}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="py-4 px-4 font-semibold">{player.name}</td>
                <td className="text-center py-4 px-4">
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-3 py-1 rounded-full font-bold">
                    {player.goals}
                  </span>
                </td>
                <td className="text-center py-4 px-4">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full font-bold">
                    {player.assists}
                  </span>
                </td>
                <td className="text-center py-4 px-4 text-muted-foreground">
                  {player.matches}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PrimaryCollapsible>
  );
}
const exampleStats = {
  totals: {
    totalPlayers: 16,
    activePlayers: 16,
    inactivePlayers: 0,
    totalInjuries: 4,
    playersWithInjuries: 3,
  },
  averages: {
    avgGoals: 0.25,
    avgAssists: 0,
    avgMatches: 3.125,
  },
  topPerformers: [
    {
      _id: "690578bfc6a26e1fef38732d",
      name: "Samhad Abudi",
      avatar:
        "https://res.cloudinary.com/dgp4vzn3m/image/upload/v1761966027/players/avatar/d26cb273db994c54a4ab1e8acebe5fd7_vomh6y.jpg",
      number: "3",
      goals: 2,
      assists: 0,
      matches: 5,
      ratingAvg: 0,
      performanceScore: 8,
    },
    {
      _id: "6903fad3e1d8a4e05ca0f1c4",
      name: "Shanelle Cassin",
      avatar:
        "https://res.cloudinary.com/dgp4vzn3m/image/upload/v1761868491/players/avatar/unus_etzsxi.jpg",
      number: "572",
      goals: 1,
      assists: 0,
      matches: 5,
      ratingAvg: 0,
      performanceScore: 4,
    },
    {
      _id: "69040e66a4956cf8b9219238",
      name: "Alexane Bradtke",
      avatar:
        "https://res.cloudinary.com/dgp4vzn3m/image/upload/v1761873356/players/avatar/IMG-20250310-WA0029_swfvy8.jpg",
      number: "345",
      goals: 1,
      assists: 0,
      matches: 5,
      ratingAvg: 0,
      performanceScore: 4,
    },
    {
      _id: "6903faaee1d8a4e05ca0f1c2",
      name: "Betty Bauch",
      avatar:
        "https://res.cloudinary.com/dgp4vzn3m/image/upload/v1761868457/players/avatar/stevo-landing_zsy4hs.png",
      number: "259",
      goals: 0,
      assists: 0,
      matches: 5,
      ratingAvg: 0,
      performanceScore: 0,
    },
    {
      _id: "6903ffdce1d8a4e05ca0f1d2",
      name: "Clark Peterson",
      avatar:
        "https://res.cloudinary.com/dgp4vzn3m/image/upload/v1761869781/players/avatar/htjzfwenxoodpwkvttnf.jpg",
      number: "596",
      goals: 0,
      assists: 0,
      matches: 5,
      ratingAvg: 0,
      performanceScore: 0,
    },
    {
      _id: "690400aee1d8a4e05ca0f1ed",
      name: "Myah Batz",
      avatar:
        "https://res.cloudinary.com/dgp4vzn3m/image/upload/v1761869910/players/avatar/WhatsApp_Image_2025-10-12_at_9.08.28_AM_1_ienbck.jpg",
      number: "633",
      goals: 0,
      assists: 0,
      matches: 5,
      ratingAvg: 0,
      performanceScore: 0,
    },
    {
      _id: "69040579e1d8a4e05ca0f1f7",
      name: "Kurtis Pollich",
      avatar:
        "https://res.cloudinary.com/dgp4vzn3m/image/upload/v1761871219/players/avatar/bftxh5ocudkcohjne0hc.jpg",
      number: "607",
      position: "forward",
      goals: 0,
      assists: 0,
      matches: 5,
      ratingAvg: 0,
      performanceScore: 0,
    },
    {
      _id: "690503ac083431eddbc7d292",
      name: "Ismail Rahman",
      avatar:
        "https://res.cloudinary.com/dgp4vzn3m/image/upload/v1761936162/players/avatar/17619361002006447873174309828509_qmrfpq.jpg",
      number: "25",
      goals: 0,
      assists: 0,
      matches: 5,
      ratingAvg: 0,
      performanceScore: 0,
    },
    {
      _id: "6905f734c57ddfc06dc3cc5f",
      name: "Renee Schmeler",
      avatar:
        "https://res.cloudinary.com/dgp4vzn3m/image/upload/v1761998617/players/avatar/b447dgtrku7a8d0co7m5.jpg",
      number: "653",
      goals: 0,
      assists: 0,
      matches: 5,
      ratingAvg: 0,
      performanceScore: 0,
    },
    {
      _id: "69061f709d3e524a9df5c2cf",
      name: "Delia Feil",
      avatar:
        "https://res.cloudinary.com/dgp4vzn3m/image/upload/v1762008916/players/IMG-20250310-WA0029_hyls1s.jpg",
      number: "74",
      position: "winger",
      goals: 0,
      assists: 0,
      matches: 5,
      ratingAvg: 0,
      performanceScore: 0,
    },
  ],
  insights: {
    averagePerformanceScore: 1,
    mostInjuredPlayer: {
      name: "Samhad Abudi",
      injuries: 2,
    },
    highestScorer: {
      _id: "690578bfc6a26e1fef38732d",
      name: "Samhad Abudi",
      avatar:
        "https://res.cloudinary.com/dgp4vzn3m/image/upload/v1761966027/players/avatar/d26cb273db994c54a4ab1e8acebe5fd7_vomh6y.jpg",
      number: "3",
      goals: 2,
      assists: 0,
      matches: 5,
      ratingAvg: 0,
      performanceScore: 8,
    },
    topAssist: {
      _id: "690578bfc6a26e1fef38732d",
      name: "Samhad Abudi",
      avatar:
        "https://res.cloudinary.com/dgp4vzn3m/image/upload/v1761966027/players/avatar/d26cb273db994c54a4ab1e8acebe5fd7_vomh6y.jpg",
      number: "3",
      goals: 2,
      assists: 0,
      matches: 5,
      ratingAvg: 0,
      performanceScore: 8,
    },
    mostActive: {
      _id: "690578bfc6a26e1fef38732d",
      name: "Samhad Abudi",
      avatar:
        "https://res.cloudinary.com/dgp4vzn3m/image/upload/v1761966027/players/avatar/d26cb273db994c54a4ab1e8acebe5fd7_vomh6y.jpg",
      number: "3",
      goals: 2,
      assists: 0,
      matches: 5,
      ratingAvg: 0,
      performanceScore: 8,
    },
  },
};
