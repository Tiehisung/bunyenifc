import { PageSEO } from "@/utils/PageSEO";
 

import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className=" h-screen relative bg-background overflow-hidden">
      {"<AdminTopNav />"}
      <div className=" flex flex-1 overflow-y-auto max-h-screen">
        {`<AdminSidebar />`}
        <div
          className="relative flex-1 p-5 bg-white overflow-y-auto pb-56 "
          id="admin-top"
        >
          <Outlet />
        </div>
      </div>{" "}
      <PageSEO title="BunyeniFC Admin" description="Bunyenifc Admin" page="admin" />
    </div>
  );
};

export default AdminLayout;
