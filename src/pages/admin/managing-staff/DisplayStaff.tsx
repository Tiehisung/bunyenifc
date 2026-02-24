import ManagerActionsPopper from "./Actions";
import { useNavigate } from "react-router-dom";
import { staticImages } from "@/assets/images";
import { DisplayType } from "@/components/DisplayStyle";
import { formatDate, getTimeLeftOrAgo } from "@/lib/timeAndDate";
import useGetParam from "@/hooks/params";
import { IStaff } from "@/types/staff.interface";

const AdminStaffMemberss = ({
  staffMembers = [],
 
}: {
  staffMembers?: IStaff[];
 
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
                {staffMembers?.map((staff) => (
                  <tr key={staff._id} className="border-primary/60 border-b">
                    <td className="px-4 py-2">
                      <img
                        src={staff?.avatar ?? staticImages.avatar}
                        alt="desc image"
                        className="h-20 w-auto aspect-square min-w-20 object-cover rounded-md bg-accent"
                      />
                    </td>
                    <td className="px-4 py-2 font-semibold">
                      {staff?.fullname}
                    </td>
                    <td className="px-4 py-2 uppercase">{staff?.role}</td>
                    <td className="px-4 py-2 font-light">
                      <span>
                        {formatDate(staff?.dateSigned, "March 2, 2025")}(
                        {getTimeLeftOrAgo(staff?.dateSigned).formatted})
                      </span>
                    </td>
                    <td className="px-4 py-2 italic">{staff?.phone}</td>
                    <td className="px-4 py-2">
                      <ManagerActionsPopper
                        staff={staff}
                     
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <ul className="flex flex-wrap items-start justify-start gap-10 mx-auto w-full">
            {(staffMembers || [])?.map((staff) => (
              <li
                key={staff._id}
                onClick={() => navigate(`/admin/staff/${staff?._id}`)}
                className="relative flex flex-col justify-center items-center gap-2 h-96 max-w-sm rounded-md shadow border _borderColor bg-secondary cursor-pointer"
              >
                <img
                  src={staff?.avatar ?? staticImages.avatar}
                  alt="desc image"
                  className="h-56 w-60 grow object-cover rounded-md"
                />
                <div className="p-5 space-y-2">
                  <p className="_label text-[grayText] first-letter:uppercase">
                    {staff?.role}
                  </p>
                  <p>{staff?.fullname}</p>
                  <p>
                    <small className="italic">Since</small>{" "}
                    <span>
                      {formatDate(staff?.dateSigned, "March 2, 2025")}(
                      {getTimeLeftOrAgo(staff?.dateSigned).formatted})
                    </span>
                  </p>
                  <p className="text-teal-400">{staff?.phone}</p>
                </div>
                <div
                  className="absolute top-2 right-2 w-fit"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ManagerActionsPopper
                    staff={staff}
                 
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

export default AdminStaffMemberss;
