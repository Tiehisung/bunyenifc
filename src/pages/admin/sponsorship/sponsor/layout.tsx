import SponsorActionsBar from "./ActionsBar";
import { Outlet } from "react-router-dom";

export default function SponsorLayout() {
  return (
    <div className="relative">
      <SponsorActionsBar />
      <br />
      <div className="flex flex-col justify-center items-center min-w-[60%]">
        <Outlet />
      </div>
    </div>
  );
}
