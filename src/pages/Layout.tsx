import { Toaster } from "sonner";
import FooterCP from "@/components/footer/FooterCp";
import HeaderCp from "@/components/HeaderCp";
import BackToTopButton from "@/components/scroll/ToTop";

import { Swinger } from "@/components/Animate/Swing";
import { Outlet } from "react-router-dom";

export default function HomeLayout() {
  return (
    <main>
      <HeaderCp />
      <div className={`min-h-screen overflow-x-hidden `}>
        <Outlet />
        <Swinger className="fixed bottom-6 right-6 z-30">
          <BackToTopButton />
        </Swinger>
        <Toaster position="top-right" richColors />
      </div>
      <FooterCP />
    </main>
  );
}
