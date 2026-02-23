import { LogoutBtn } from "@/components/auth/Auth";
import { NavigationPopover } from "@/components/NavigationPopover";
import { ThemeModeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";
import {
  PrimaryAdminSidebar,
  SidebarLink,
  sidebarLinks,
} from "./(sidebar)/PrimarySidebarAdmin";

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
  return (
    <NavigationPopover
      align="start"
      triggerStyles="md:hidden"
      className="backdrop-blur-sm text-white w-fit relative"
    >
      <ul className="w-full relative">
        <li>
          {sidebarLinks.map((link, i) => (
            <SidebarLink key={i} item={link} />
          ))}
        </li>
      </ul>
      <li className=" mt-12 px-3 flex gap-6 items-center sticky bottom-0 backdrop-blur-sm bg-muted/30">
        {/* <UserLogButtons /> */}
        <ThemeModeToggle className="w-full" />
      </li>
    </NavigationPopover>
  );
}
