import { Outlet, NavLink, Link } from "react-router-dom";
import { ReactNode, useState } from "react";
import {
  HiOutlineHome,
  HiOutlineCreditCard,
  HiOutlineClipboardDocumentCheck,
  HiOutlineUser,
  HiOutlineShieldCheck,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlinePlusCircle,
  HiOutlinePhone,
} from "react-icons/hi2";
import { useAppSelector } from "@/store/hooks/store";
import { LogoutBtn } from "@/pages/auth/LogoutButton";
import { EUserRole } from "@/types/user";
import { AppName } from "../Navbar";
interface IDashboardLink {
  href: string;
  icon: ReactNode;
  label: string;
  end?: boolean;
  role?: EUserRole[];
}

export const dashboardSidebarLinks: IDashboardLink[] = [
  {
    href: "/dashboard",
    icon: <HiOutlineHome className="w-5 h-5" />,
    label: "Overview",
    end: true,
  },
  {
    href: "/dashboard/listings",
    icon: <HiOutlinePlusCircle className="w-5 h-5" />,
    label: "My Listings",
    role: [EUserRole.SELLER],
  },
  {
    href: "/dashboard/requests",
    icon: <HiOutlinePhone className="w-5 h-5" />,
    label: "My Requests",
    role: [EUserRole.BUYER],
  },
  {
    href: "/dashboard/payments",
    icon: <HiOutlineCreditCard className="w-5 h-5" />,
    label: "Payments",
  },
  {
    href: "/dashboard/inspections",
    icon: <HiOutlineClipboardDocumentCheck className="w-5 h-5" />,
    label: "Inspections",
    role: [EUserRole.SELLER],
  },

  {
    href: "/dashboard/verify-identity",
    icon: <HiOutlineShieldCheck className="w-5 h-5" />,
    label: "Verify Identity",
  },
  {
    href: "/dashboard/leads",
    icon: <HiOutlinePhone className="w-5 h-5" />,
    label: "Buyer Leads",
    role: [EUserRole.SELLER],
  },

  {
    href: "/dashboard/profile",
    icon: <HiOutlineUser className="w-5 h-5" />,
    label: "Profile",
  },
];

const DashboardLayout = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const userSidebarLinks = dashboardSidebarLinks
    .filter((sl) => !sl.role || sl.role?.includes(user?.role!))
    .flat();

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <nav className="space-y-1">
      {user?.role === "seller" && (
        <Link
          to="/dashboard/listings/create"
          onClick={onClick}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
            bg-brand text-brand-foreground hover:opacity-90 transition-opacity mb-3"
        >
          <HiOutlinePlusCircle className="w-5 h-5" />
          Post New Listing
        </Link>
      )}
      {userSidebarLinks.map((link) => (
        <NavLink
          key={link.href}
          to={link.href}
          end={link.end}
          onClick={onClick}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? "bg-brand-muted text-brand"
                : "text-surface-500 hover:bg-surface-50 hover:text-surface-700"
            }`
          }
        >
          {link.icon}
          {link.label}
        </NavLink>
      ))}

      <LogoutBtn onClick={onClick} className="mt-8" />
    </nav>
  );

  return (
    <div className="h-screen flex overflow-hidden">
      {/* ============ DESKTOP SIDEBAR ============ */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-surface-elevated border-r border-border">
        <div className="p-6 pb-4">
          <AppName className="text-lg" />
          <span className="block text-xs text-surface-400 font-normal mt-1">
            {`${user?.fullName?.split(" ")?.[1]} ...${user?.phoneNumber?.substring(6)}`}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          <NavLinks />
        </div>
      </aside>

      {/* ============ MOBILE HEADER ============ */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 _glass h-14 flex items-center justify-between px-4">
        <AppName className="text-lg" />
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-surface-muted rounded-xl transition-colors"
        >
          {mobileMenuOpen ? (
            <HiOutlineXMark className="w-5 h-5 text-surface-foreground" />
          ) : (
            <HiOutlineBars3 className="w-5 h-5 text-surface-foreground" />
          )}
        </button>
      </div>

      {/* ============ MOBILE SLIDE-OVER MENU ============ */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />
          {/* Drawer */}
          <div className="lg:hidden fixed top-14 left-0 bottom-0 z-40 w-72 bg-surface-elevated border-r border-border shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="p-4 overflow-y-auto h-full">
              <NavLinks onClick={closeMobileMenu} />
              <p className="block text-xs text-surface-400 font-normal mt-12 text-center grow bg-accent py-2">
                {`${user?.fullName?.split(" ")?.[1]} ...${user?.phoneNumber?.substring(6)}`}
              </p>
            </div>
          </div>
        </>
      )}

      {/* ============ MAIN CONTENT - ONLY THIS SCROLLS ============ */}
      <main className="flex-1 overflow-y-auto bg-surface">
        <div className="p-4 lg:p-8 pt-20 lg:pt-8 pb-24 lg:pb-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
