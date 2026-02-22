import LAYOUT from "@/components/Layout";
import AdminDashboardPage from "@/pages/admin/Dashboard";
import NewFixturePage from "@/pages/admin/matches/create-fixture/page";
import MatchHighlightsPage from "@/pages/admin/media/highlights/page";
import LiveMatchPage from "@/pages/admin/matches/live-match/page";
import MatchPage from "@/pages/admin/matches/match/page";
import MVPsPage from "@/pages/admin/matches/mvps/page";
import AdminFixtures from "@/pages/admin/matches/page";
import MatchRequestPage from "@/pages/admin/matches/request/page";
import NewsEditingPage from "@/pages/admin/news/edit/page";
import AdminNewsLayout from "@/pages/admin/news/NewsLayout";
import AdminNewsPage from "@/pages/admin/news/page";
import AdminPlayersLayout from "@/pages/admin/players/AdminPlayersLayout";
import CaptaincyPage from "@/pages/admin/players/captaincy/page";
import AdminPlayerSignupPage from "@/pages/admin/players/new/page";
import AdminPlayer from "@/pages/admin/players/new/page";
import AdminPlayers from "@/pages/admin/players/page";
import PlayerProfilePage from "@/pages/admin/players/player/page";
import { RouteObject } from "react-router-dom";
import GalleriesAdmin from "@/pages/admin/media/galleries/page";
import SquadPage from "@/pages/admin/squad/page";
import FinancePage from "@/pages/admin/finance/page";
import DocsPage from "@/pages/admin/docs/page";
import AllDocsPage from "@/pages/admin/docs/files/page";
import FolderPage from "@/pages/admin/docs/[folder]/page";
import CardsPage from "@/pages/admin/cards/page";
import TechnicalManagersPage from "@/pages/admin/managers/page";
import ManagerPage from "@/pages/admin/managers/manager/page";
import TeamsFeature from "@/pages/admin/teams/page";
import TrainingSettingsAdm from "@/pages/admin/training/page";
import AttendancePage from "@/pages/admin/training/attendance/page";
import { InjuriesManager } from "@/pages/admin/injuries/InjuresManager";
import AdminSponsorshipPage from "@/pages/admin/sponsorship/page";
import AdminSponsor from "@/pages/admin/sponsorship/sponsor/page";
import LogsPage from "@/pages/admin/logs/page";
import UsersPage from "@/pages/admin/users/page";

export const adminRoutes: RouteObject[] = [
  { path: "", element: <AdminDashboardPage /> },

  {
    path: "players",
    element: <AdminPlayersLayout />,
    children: [
      { index: true, element: <AdminPlayers /> },
      { path: "new", element: <AdminPlayerSignupPage /> },
      { path: "captaincy", element: <CaptaincyPage /> },
      { path: ":playerSlug", element: <PlayerProfilePage /> },
    ],
  },

  {
    path: "news",
    element: <AdminNewsLayout />,
    children: [
      { index: true, element: <AdminNewsPage /> },
      { path: "edit", element: <NewsEditingPage /> },
      { path: ":newsSlug", element: <AdminPlayer /> },
    ],
  },
  {
    path: "matches",
    element: <LAYOUT />,
    children: [
      { index: true, element: <AdminFixtures /> },
      { path: "request", element: <MatchRequestPage /> },
      { path: "create-fixture", element: <NewFixturePage /> },
      { path: "highlights", element: <MatchHighlightsPage /> },
      { path: "live-match", element: <LiveMatchPage /> },
      { path: "mvps", element: <MVPsPage /> },
      { path: ":matchSlug", element: <MatchPage /> },
    ],
  },

  { path: "galleries", element: <GalleriesAdmin /> },
  { path: "highlights", element: <MatchHighlightsPage /> },

  {
    path: "training",
    element: <LAYOUT />,
    children: [
      { index: true, element: <TrainingSettingsAdm /> },
      { path: "attendance", element: <AttendancePage /> },
    ],
  },
  {
    path: "managers",
    element: <LAYOUT />,
    children: [
      { index: true, element: <TechnicalManagersPage /> },
      { path: ":managerSlug", element: <ManagerPage /> },
    ],
  },
  {
    path: "docs",
    element: <LAYOUT />,
    children: [
      { index: true, element: <DocsPage /> },
      { path: "files", element: <AllDocsPage /> },
      { path: ":folderSlug", element: <FolderPage /> },
    ],
  },
  {
    path: "sponsorship",
    element: <LAYOUT />,
    children: [
      { index: true, element: <AdminSponsorshipPage /> },
      { path: ":sponsorSlug", element: <AdminSponsor /> },
    ],
  },
  { path: "squad", element: <SquadPage /> },
  { path: "cards", element: <CardsPage /> },
  { path: "mvps", element: <MVPsPage /> },
  { path: "teams", element: <TeamsFeature /> },
  { path: "injuries", element: <InjuriesManager /> },

  // Operations
  { path: "sponsorship", element: <SquadPage /> },
  { path: "finance", element: <FinancePage /> },
  { path: "users", element: <UsersPage /> },
  { path: "logs", element: <LogsPage /> },
];
