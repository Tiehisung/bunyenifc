import { LogoutBtn } from "@/components/auth/Auth";
import { NavigationPopover } from "@/components/NavigationPopover";
import { ThemeModeToggle } from "@/components/ThemeToggle";
import { Ambulance, Logs, Users, Columns } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineTeam } from "react-icons/ai";
import { CgDatabase } from "react-icons/cg";
import { FcManager } from "react-icons/fc";
import { FiUserCheck } from "react-icons/fi";
import { GiBabyfootPlayers } from "react-icons/gi";
import { GrDashboard, GrGallery } from "react-icons/gr";
import { LiaDonateSolid, LiaRunningSolid } from "react-icons/lia";
import {
  MdOutlineDocumentScanner,
  MdOutlineFeaturedPlayList,
  MdOutlineLiveTv,
} from "react-icons/md";
import { PiNewspaperThin } from "react-icons/pi";
import { RiHomeLine } from "react-icons/ri";
import { PrimaryAdminSidebar } from "./(sidebar)/PrimarySidebarAdmin";
import { fireEscape } from "@/hooks/Esc";

export function LeftPaneDesktop() {
  return (
    <div className="max-md:hidden bg-accent max-h-screen overflow-y-auto py-6">
      <div className="p-6 flex items-center gap-6 justify-between">
        <Link to="/" className="text-2xl font-semibold grow flex" title="Home">
          ⚽ KonFC
        </Link>
        <ThemeModeToggle />
      </div>

      <PrimaryAdminSidebar />

      <footer className="flex flex-wrap p-3 items-center gap-3.5 justify-between border-t border-secondary-foreground/20">
        <LogoutBtn text="Logout" className="grow" />
      </footer>
    </div>
  );
}

export function LeftPaneMobile() {
  const location = useLocation();
  const pathname = location.pathname;
  const activeLink = (linkname: string) => pathname === linkname;

  const mobileLinks = [
    {
      label: "Home",
      path: "/",
      icon: <RiHomeLine />,
    },
    ...sidebarLinks,
  ];

  return (
    <NavigationPopover
      align="start"
      triggerStyles="md:hidden"
      className="backdrop-blur-sm text-white w-fit"
    >
      <ul className="w-full max-h-[80vh] overflow-y-auto relative">
        {mobileLinks.map((slink, index) => (
          <li
            key={index}
            className={`flex _hover _shrink px-2 rounded-md ${
              activeLink(slink.path) ? "bg-popover/70" : ""
            }`}
          >
            <Link
              className="flex gap-1 w-full items-center h-10 text-sm font-light"
              to={slink.path}
              onClick={() => fireEscape()}
            >
              <span className="text-xl bg-accent/30 rounded-full p-1.5">
                {slink.icon}
              </span>
              {slink.label}
            </Link>
          </li>
        ))}

        <li className="mt-12 px-3 flex gap-6 items-center sticky bottom-0 backdrop-blur-md bg-muted/30">
          <ThemeModeToggle className="w-full" />
          {/* <UserLogButtons /> */}
        </li>
      </ul>
    </NavigationPopover>
  );
}

const sidebarLinks = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: <GrDashboard />,
  },
  {
    label: "Docs",
    path: "/admin/docs",
    icon: <MdOutlineDocumentScanner />,
  },
  {
    label: "Features",
    path: "/admin/features",
    icon: <MdOutlineFeaturedPlayList />,
  },
  {
    label: "Matches",
    path: "/admin/matches",
    icon: <CgDatabase />,
  },
  {
    label: "Highlights",
    path: "/admin/highlights",
    icon: <MdOutlineLiveTv />,
  },
  {
    label: "Live match",
    path: "/admin/live-match",
    icon: <MdOutlineLiveTv />,
  },
  {
    label: "Teams",
    path: "/admin/features/teams",
    icon: <AiOutlineTeam />,
  },
  {
    label: "Squad",
    path: "/admin/squad",
    icon: <CgDatabase />,
  },
  {
    label: "Players",
    path: "/admin/players",
    icon: <GiBabyfootPlayers />,
  },
  {
    label: "Training",
    path: "/admin/training",
    icon: <LiaRunningSolid />,
  },
  {
    label: "Managers",
    path: "/admin/managers",
    icon: <FcManager />,
  },
  {
    label: "News",
    path: "/admin/news",
    icon: <PiNewspaperThin />,
  },
  {
    label: "Sponsorship",
    path: "/admin/sponsorship",
    icon: <LiaDonateSolid />,
  },
  {
    label: "Finance",
    path: "/admin/resources/finance",
    icon: <LiaDonateSolid />,
  },
  {
    label: "Gallery",
    path: "/admin/galleries",
    icon: <GrGallery />,
  },
  {
    label: "Attendance",
    path: "/admin/training/attendance",
    icon: <FiUserCheck />,
  },
  {
    label: "Injuries",
    path: "/admin/injuries",
    icon: <Ambulance />,
  },
  {
    label: "Cards",
    path: "/admin/cards",
    icon: <Columns />,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: <Users />,
  },
  {
    label: "Logs",
    path: "/admin/logs",
    icon: <Logs />,
  },
];
