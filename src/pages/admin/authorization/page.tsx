import { apiConfig } from "@/lib/configs";
import AdminsActionsPopper from "./Actions";
import { formatDate } from "@/lib/timeAndDate";
import { DIALOG } from "@/components/Dialog";
import { Button } from "@/components/buttons/Button";
import { IUser } from "@/types/user";
import CreateAdmin from "./CreateAdmin";

export const getUsers = async (q?: string) => {
  const resp = await fetch(
    apiConfig.users + (q && q.startsWith("?") ? q : ""),
    {
      cache: "no-cache",
    }
  );
  const admins = await resp.json();
  return admins;
};

export const getUserById = async (id?: string) => {
  const resp = await fetch(`${apiConfig.users}/${id}`, {
    cache: "no-cache",
  });

  return await resp.json();
};

const AuthorizationPage = async () => {
  // const session: IAdminSession | null = await getServerSession(authOptions);

  const admins: IUser[] = await getUsers();

  // if (session?.user?.role !== "super_admin")
  //   return (
  //     <div>
  //       <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
  //         <h1 className="text-4xl font-bold text-red-500 mb-4">
  //           Access Denied
  //         </h1>
  //         <p className="text-lg text-gray-600 mb-8">
  //           You do not have the necessary permissions to access this page.
  //         </p>

  //         <BackBtn label="Return" />
  //       </div>
  //     </div>
  //   );
  return (
    <div>
      <header className="flex px-5 pt-4">
        <DIALOG
          title=""
          trigger={
            <Button
              primaryText="Create Admin"
              className="_primaryBtn p-2 text-sm ml-auto "
            />
          }
        >
          <CreateAdmin />
        </DIALOG>
      </header>
      <div className="max-full overflow-x-auto pb-40 px-[4%]">
        <table className="table">
          <caption>Authorized system administrators</caption>
          <tbody>
            <tr>
              <th>Image</th>
              <th>Details</th>
              <th></th>

              <th></th>
            </tr>
            {admins?.map((admin, index) => (
              <tr
                key={index}
                className={`border-gray-300 ${
                  !admin.isActive ? "line-through opacity-75" : ""
                }`}
              >
                <td>
                  <img
                    src={admin.image}
                    width={300}
                    height={300}
                    alt="desc image"
                    className="h-16 w-16 min-w-16 rounded-full bg-slate-50"
                  />
                </td>
                <td>
                  <p className="_label"> {admin.name}</p>
                  <p
                    className={`badge capitalize font-light ${
                      admin.role == "super_admin"
                        ? "badge-primary"
                        : "badge-secondary"
                    }`}
                  >
                    {admin?.role?.replace("_", " ")}
                  </p>
                  <time className="border-l px-2 ml-2 italic">
                    {formatDate(
                      (admin?.dateEngaged as string) ??
                        (admin?.createdAt as string)
                    )}
                  </time>
                </td>
                <td className="font-light">{admin.email}</td>
                <td>
                  <AdminsActionsPopper admin={admin} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuthorizationPage;
