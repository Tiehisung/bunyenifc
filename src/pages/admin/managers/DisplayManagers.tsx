import { IManager } from "./page";
import ManagerActionsPopper from "./Actions";
import { useNavigate } from "react-router-dom";
import { staticImages } from "@/assets/images";
import { DisplayType } from "@/components/DisplayStyle";
import { formatDate, getTimeLeftOrAgo } from "@/lib/timeAndDate";
import { IFeature } from "../features/OptionsFeature";
import { ISelectOptionLV } from "@/types";
import useGetParam from "@/hooks/params";

const AdminManagers = ({
  managers,
  roles,
}: {
  managers?: IManager[];
  roles: IFeature<ISelectOptionLV[]>;
}) => {
  const viewStyle = useGetParam("display");
  const navigate = useNavigate();

  return (
    <div className="px-[2vw] relative">
      <section className="rounded-3xl p-4 pb-36">
        <DisplayType defaultDisplay="grid" />
        <br />
        {viewStyle === "list" ? (
          <div className="max-full overflow-x-auto mx-auto">
            <table className="table w-full border border-primary/60">
              <tbody>
                <tr className="_label text-nowrap text-left bg-muted text-muted-foreground h-12 uppercase">
                  <th className="px-4 py-2">Image</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Date signed</th>
                  <th className="px-4 py-2">Contact</th>
                  <th className="px-4 py-2"></th>
                </tr>
                {managers?.map((manager) => (
                  <tr key={manager._id} className="border-primary/60 border-b">
                    <td className="px-4 py-2">
                      <img
                        src={manager?.avatar ?? staticImages.avatar}
                        alt="desc image"
                        className="h-20 w-auto aspect-square min-w-20 object-cover rounded-md bg-accent"
                      />
                    </td>
                    <td className="px-4 py-2 font-semibold">
                      {manager?.fullname}
                    </td>
                    <td className="px-4 py-2 uppercase">{manager?.role}</td>
                    <td className="px-4 py-2 font-light">
                      <span>
                        {formatDate(manager?.dateSigned, "March 2, 2025")}(
                        {getTimeLeftOrAgo(manager?.dateSigned).formatted})
                      </span>
                    </td>
                    <td className="px-4 py-2 italic">{manager?.phone}</td>
                    <td className="px-4 py-2">
                      <ManagerActionsPopper
                        manager={manager}
                        availableRoles={roles?.data ?? []}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <ul className="flex flex-wrap items-start justify-start gap-10 mx-auto w-full">
            {managers?.map((manager) => (
              <li
                key={manager._id}
                onClick={() => navigate(`/admin/managers/${manager?._id}`)}
                className="relative flex flex-col justify-center items-center gap-2 h-96 max-w-sm rounded-md shadow border _borderColor bg-secondary cursor-pointer"
              >
                <img
                  src={manager?.avatar ?? staticImages.avatar}
                  alt="desc image"
                  className="h-56 w-60 grow object-cover rounded-md"
                />
                <div className="p-5 space-y-2">
                  <p className="_label text-[grayText] first-letter:uppercase">
                    {manager?.role}
                  </p>
                  <p>{manager?.fullname}</p>
                  <p>
                    <small className="italic">Since</small>{" "}
                    <span>
                      {formatDate(manager?.dateSigned, "March 2, 2025")}(
                      {getTimeLeftOrAgo(manager?.dateSigned).formatted})
                    </span>
                  </p>
                  <p className="text-teal-400">{manager?.phone}</p>
                </div>
                <div
                  className="absolute top-2 right-2 w-fit"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ManagerActionsPopper
                    manager={manager}
                    availableRoles={roles?.data ?? []}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AdminManagers;
