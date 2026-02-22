"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarLinkGroups } from "../admin/(sidebar)/GroupedSidebarLinks";
import { PrimaryAdminSidebar } from "../admin/(sidebar)/PrimarySidebarAdmin";

export default function GroupedAdminSidebar() {
  const pathname = usePathname();

  if (1 < 8) return <PrimaryAdminSidebar />;

  return (
    <aside className="w-64 border-r h-screen overflow-y-auto bg-card">
      {sidebarLinkGroups.map((group) => (
        <div key={group.label} className="mb-6">
          <h3 className="px-4 mb-2 text-xs font-semibold uppercase text-muted-foreground">
            {group.label}
          </h3>

          <div className="space-y-1">
            {group.links.map((item) => {
              const active = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm transition ${
                    active
                      ? "bg-primary "
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}
