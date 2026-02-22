import { PopperToLeft } from "@/components/Poppers";
import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import CreateAdmin from "./CreateAdmin";
import { apiConfig } from "@/lib/configs";

import { toast } from "sonner";
import { IoPersonAddOutline, IoPersonRemoveOutline } from "react-icons/io5";
import { Button } from "@/components/buttons/Button";

import { AiTwotoneDelete } from "react-icons/ai";

import { DIALOG } from "@/components/Dialog";
import { IUser } from "@/types/user";
import { getErrorMessage } from "@/lib/error";
import { useNavigate } from "react-router-dom";

export interface IAdminSession {
  user: {
    name: string;
    image: string;
    role: IUser["role"];
    email: string;
  };
}

const AdminsActionsPopper = ({ admin }: { admin: IUser }) => {
  // const { data: session } = useSession({ required: true });
  const isAuthorized =
    { user: { role: "super_admin" } }?.user?.role == "super_admin";

  const className =
    "flex items-center justify-start gap-2 w-full py-2 px-3 h-9 hover:bg-gray-200 slowTrans select-none cursor-pointer line-clamp-1 whitespace-nowrap";

  return (
    <PopperToLeft>
      <ul>
        <li>
          <AdminEngagement
            admin={admin}
            className={className}
            isAuthorized={isAuthorized}
          />
        </li>
        <li className={className}>
          <DIALOG
            trigger={
              <div className={` w-full grow flex items-center gap-2`}>
                <CiEdit /> Edit {admin.name.split(" ")[0]}
              </div>
            }
            title={undefined}
          >
            <CreateAdmin existingUser={admin} />
          </DIALOG>
        </li>

        <li>
          <AdminDelete
            admin={admin}
            isAuthorized={isAuthorized}
            className={className}
          />
        </li>
      </ul>
    </PopperToLeft>
  );
};

export default AdminsActionsPopper;

// Engagement
export function AdminEngagement({
  admin,
  className,
  isAuthorized,
}: {
  admin: IUser;
  className?: string;
  isAuthorized: boolean;
}) {
  const navigate = useNavigate();

  const [waiting, setWaiting] = useState(false);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (!isAuthorized) return toast.error("Forbidden action!");
      setWaiting(true);
      const response = await fetch(`${apiConfig.users}/${admin._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
      });
      const results = await response.json();
      if (results.success) toast.success(results.message);
      else toast.error(results.message);
      setWaiting(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update admin"));
    } finally {
      setWaiting(false);
      navigate(0);
    }
  };
  return (
    <Button
      waiting={waiting}
      disabled={waiting || !isAuthorized}
      primaryText={admin.isActive ? "Disengage" : "Re-engage"}
      waitingText="Processing..."
      onClick={handleDelete}
      className={className}
    >
      {admin.isActive ? (
        <IoPersonRemoveOutline className={waiting ? "hidden" : ""} />
      ) : (
        <IoPersonAddOutline className={waiting ? "hidden" : ""} />
      )}
    </Button>
  );
}

// Delete
export function AdminDelete({
  admin,
  className,
  isAuthorized,
}: {
  admin: IUser;
  className?: string;
  isAuthorized: boolean;
}) {
  const navigate = useNavigate();
  const [waiting, setWaiting] = useState(false);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (!isAuthorized) return toast.error("Forbidden action!");
      setWaiting(true);
      const response = await fetch(`${apiConfig.users}/${admin._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
      });
      const results = await response.json();
      if (results.success) toast.success(results.message);
      else toast.error(results.message);
      setWaiting(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete admin"));
    } finally {
      setWaiting(false);
      navigate(0);
    }
  };
  return (
    <Button
      waiting={waiting}
      disabled={waiting || !isAuthorized}
      primaryText={`Delete ${admin.name?.split(" ")?.[0]}`}
      waitingText="Processing..."
      onClick={handleDelete}
      className={`whitespace-nowrap ${className}`}
    >
      <AiTwotoneDelete className={waiting ? "hidden" : ""} />
    </Button>
  );
}
