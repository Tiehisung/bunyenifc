import { IStaff } from "@/types/staff.interface";
import TechnicalManagerForm from "./StaffForm";
import { POPOVER } from "@/components/ui/popover";
import { Edit3, TrashIcon } from "lucide-react";
import { HiOutlineUserRemove } from "react-icons/hi";
import { Button } from "@/components/buttons/Button";
import { useUpdateSearchParams } from "@/hooks/params";
import { fireEscape } from "@/hooks/Esc";
import { StackModal } from "@/components/modals/StackModal";
import { RtkActionButton } from "@/components/buttons/ActionButtonRTK";
import {
  useDeleteStaffMutation,
  useUpdateStaffMutation,
} from "@/services/staff.endpoints";

const StaffActionsPopper = ({ staff }: { staff: IStaff }) => {
  const { setParam } = useUpdateSearchParams();

  return (
    <>
      <POPOVER>
        <div className="grid gap-1">
          <Button
            className="w-full _hover bg-transparent _shrink _secondaryBtn"
            onClick={() => {
              setParam("stackModal", staff._id);
              fireEscape();
            }}
          >
            <Edit3 /> Edit
          </Button>

          <RtkActionButton
            mutation={useUpdateStaffMutation}
            data={{ id: staff._id, isActive: false }}
            primaryText="Disengage Manager"
            loadingText="Disengaging..."
            variant="secondary"
            onSuccess={(res) => {
              console.log("manager disengaged", res);
            }}
          >
            <HiOutlineUserRemove size={20} />
          </RtkActionButton>

          <RtkActionButton
            mutation={useDeleteStaffMutation}
            data={staff._id}
            primaryText="Delete Manager"
            loadingText="Deleting..."
            variant="destructive"
            onSuccess={(res) => {
              console.log("manager deleted", res);
            }}
          >
            <TrashIcon />
          </RtkActionButton>
        </div>
      </POPOVER>

      <StackModal
        id={staff._id}
        className="bg-accent rounded-2xl _hideScrollbar"
      >
        <TechnicalManagerForm
          existingStaff={staff}
          className="lg:flex flex-col min-w-[70vw]"
        />
      </StackModal>
    </>
  );
};

export default StaffActionsPopper;
