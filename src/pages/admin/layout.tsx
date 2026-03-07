import AdminFooter from "./Footer";
import { LeftPaneDesktop, LeftPaneMobile } from "./AdminSidebar";
import { staticImages } from "@/assets/images";
import Breadcrumbs from "@/components/Breadcrumbs";
import BackBtn from "@/components/buttons/BackBtn";
import Loader from "@/components/loaders/Loader";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/hooks/store";

export default function AdminLayout() {
  
  return (
    <main className="md:flex relative">
      <LeftPaneDesktop />
      <section className="flex-1 md:h-screen md:overflow-y-auto">
        <Header />
        <div className="pt-4 md:pt-2 bg-accent">
          <Outlet />
        </div>
        <AdminFooter />
      </section>
      
    </main>
  );
}

const Header = () => {
  const { user ,isLoading} = useAppSelector((s) => s.auth);

  const alias = user?.name?.split(" ")?.[0] ?? user?.email?.split("@")?.[0];

  if (isLoading) {
    return (
      <header className="flex justify-between px-6 p-1 sticky top-0.5 bg-accent z-20 items-center border-b border-border">
        <LeftPaneMobile />
        <div className="hidden sm:flex items-center gap-4 flex-wrap">
          <BackBtn />
          <Breadcrumbs />
        </div>
        <div className="flex items-center gap-3 text-sm ml-auto divide-x">
          <div className="_label">
            <p className="text-xs italic font-light">Admin</p>
            <Loader size="sm" />
          </div>
          <div className="h-10 w-10 min-h-10 rounded-full bg-muted animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header className="flex justify-between px-6 p-1 sticky top-0.5 bg-accent z-20 items-center border-b border-border">
      <LeftPaneMobile />
      <div className="hidden sm:flex items-center gap-4 flex-wrap">
        <BackBtn />
        <Breadcrumbs />
      </div>
      <div className="flex items-center gap-3 text-sm ml-auto divide-x">
        <div className="_label">
          <p className="text-xs italic font-light">Admin</p>
          <p>{alias}</p>
        </div>
        <img
          src={user?.image ?? staticImages.avatar}
          alt="avatar"
          className="h-10 w-10 min-h-10 rounded-full object-cover"
        />
      </div>
    </header>
  );
};
