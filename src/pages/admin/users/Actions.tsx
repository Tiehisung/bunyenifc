import { ConfirmActionButton } from "@/components/buttons/ConfirmAction";
import { PrimaryDropdown } from "@/components/Dropdown";
import { IUser } from "@/types/user";
import { Edit } from "lucide-react";
import { MdOutlineDelete } from "react-icons/md";
import UserForm from "./UserForm";
import { Button } from "@/components/buttons/Button";
import { DIALOG } from "@/components/Dialog";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDeleteUserMutation } from "@/services/user.endpoints";

interface IProps {
  user?: IUser;
}

export function UserActions({ user }: IProps) {
  const navigate = useNavigate();
  const [deleteUser] = useDeleteUserMutation();

  const className = `flex items-center gap-2 grow _hover _shrink p-2 text-sm`;

  const handleDelete = async () => {
    if (!user?._id) return;

    try {
      const result = await deleteUser(user._id).unwrap();
      if (result.success) {
        toast.success(result.message);
        navigate(0);
      }
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <PrimaryDropdown id={user?._id}>
      <ul>
        <li>
          <DIALOG
            trigger={
              <Button
                variant="ghost"
                className={`_shrink w-full justify-start rounded-none ${className}`}
              >
                <Edit className="text-muted-foreground" /> Edit
              </Button>
            }
            title={<p>Edit User - {user?.name}</p>}
          >
            <UserForm user={user} />
          </DIALOG>
        </li>

        <li>
          <ConfirmActionButton
            primaryText="Delete"
            trigger={
              <div className={className}>
                <MdOutlineDelete size={24} /> Delete
              </div>
            }
            onConfirm={handleDelete}
            variant="destructive"
            title="Delete User"
            confirmText={`Are you sure you want to delete ${user?.name}?`}
          />
        </li>
      </ul>
    </PrimaryDropdown>
  );
}
