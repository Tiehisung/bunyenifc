import { Link, useLocation } from "react-router-dom";
import { BiTable } from "react-icons/bi";
import { TbPlayFootball, TbTableRow } from "react-icons/tb";
import { RiNewsLine } from "react-icons/ri";
import { SiGithubsponsors } from "react-icons/si";
import UserLogButtons from "./UserLogger";
import { ThemeModeToggle } from "./ThemeToggle";
import { NavigationPopover } from "./NavigationPopover";
import { GalleryThumbnails } from "lucide-react";
import { fireEscape } from "@/hooks/Esc";
import { TEAM } from "@/data/teamBnfc";

export default function HeaderCp() {
  const location = useLocation();
  const pathname = location.pathname;

  if (pathname.startsWith("/admin")) return null;

  return (
    <div
      className={`h-14 fixed z-50 top-1 left-1/2 -translate-x-1/2 flex gap-6 justify-between items-center w-fit px-2 from-primary/25 to-background/25 backdrop-blur-sm rounded-full border shadow`}
    >
      <Link to="/">
        <div className="flex items-center gap-2 w-fit">
          <span className="text-Orange first-letter:capitalize font-bold">{TEAM.alias}</span>
        </div>
      </Link>
      <div className="container ml-auto flex justify-end items-center">
        <DesktopNav />
        <MobilePublicNav />
      </div>
    </div>
  );
}

export const DesktopNav = () => {
  return (
    <ul className="hidden lg:flex items-center font-semibold cursor-auto text-sm overflow-x-auto">
      {navLinks.map((lk, index) => (
        <li
          key={index}
          style={{ background: bgcolors[index] }}
          className={`flex flex-col font-semibold capitalize text-white overflow-hidden ${
            index === 0
              ? "rounded-l-full"
              : index === navLinks.length - 1
                ? "rounded-r-full"
                : ""
          }`}
        >
          <Link
            to={lk.href}
            className="group flex flex-col grow justify-center items-center pt-1 px-2"
          >
            <span className="_p whitespace-nowrap">{lk.title}</span>
            <hr className="w-0 group-hover:w-full h-1 bg-green-500 transition-all duration-300 delay-100" />
          </Link>
        </li>
      ))}

      <li className="ml-3">
        <UserLogButtons />
      </li>
      <li className="ml-3">
        <ThemeModeToggle />
      </li>
    </ul>
  );
};

const bgcolors = [
  "#901161",
  "#202ae6",
  "#9ab0a3",
  "#4B4B4B",
  "#f44949",
  "#b09a9a",
  "#a8c10a",
  "white",
];

const navLinks = [
  {
    title: "Sponsors",
    href: "/sponsorship",
    icon: <SiGithubsponsors size={24} />,
  },
  { title: "Players", href: "/players", icon: <TbPlayFootball size={24} /> },
  { title: "Matches", href: "/matches", icon: <BiTable size={24} /> },
  { title: "Live", href: "/matches/live", icon: <TbTableRow size={24} /> },
  { title: "News", href: "/news", icon: <RiNewsLine size={24} /> },
  { title: "Gallery", href: "/gallery", icon: <GalleryThumbnails size={24} /> },
];

export const MobilePublicNav = () => {
  // const { user, isLoading } = useAuth(); // From your auth context
  // const role = { role: "player" }?.role;
  // const dashboardRoute =
  //   role === "player"
  //     ? "/player/dashboard"
  //     : role?.includes("admin")
  //       ? "/admin"
  //       : "";

  return (
    <NavigationPopover>
      <ul className="w-full space-y-2 text-white">
        {navLinks.map((nlink, index) => (
          <li key={index} className="flex _hover">
            <Link
              to={nlink.href}
              className="flex gap-1 w-full items-center h-10 hover:font-black px-2"
              onClick={() => fireEscape()}
            >
              <span className="text-xl bg-accent/30 rounded-full p-1.5">
                {nlink.icon}
              </span>
              {nlink.title}
            </Link>
          </li>
        ))}
        {/* {!isLoading && user && (
          <li className="flex _hover">
            <Link
              to={dashboardRoute}
              className="flex gap-1 w-full items-center h-10 hover:font-semibold px-2"
            >
              <span className="text-xl bg-accent/30 rounded-full p-1.5">
                <GrDashboard />
              </span>
              Dashboard
            </Link>
          </li>
        )} */}
        <li className="mt-12 px-3 flex gap-3 items-center">
          <ThemeModeToggle />
          {/* <UserLogButtons /> */}
        </li>
      </ul>
    </NavigationPopover>
  );
};
