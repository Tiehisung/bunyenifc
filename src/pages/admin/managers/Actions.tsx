import { IManager } from "./page";
import TechnicalManagerForm from "./ManagerForm";
import { POPOVER } from "@/components/ui/popover";
import { Edit3, TrashIcon } from "lucide-react";
import { HiOutlineUserRemove } from "react-icons/hi";
import { Button } from "@/components/buttons/Button";
import { useUpdateSearchParams } from "@/hooks/params";
import { fireEscape } from "@/hooks/Esc";
import { StackModal } from "@/components/modals/StackModal";
import { ISelectOptionLV } from "@/types";
import { RtkActionButton } from "@/components/buttons/ActionButtonRTK";
import {
  useDeleteManagerMutation,
  useUpdateManagerMutation,
} from "@/services/manager.endpoints";

const ManagerActionsPopper = ({
  manager,
  availableRoles,
}: {
  manager: IManager;
  availableRoles: ISelectOptionLV[];
}) => {
  const { setParam } = useUpdateSearchParams();

  return (
    <>
      <POPOVER>
        <div className="grid gap-1">
          <Button
            className="w-full _hover bg-transparent _shrink _secondaryBtn"
            onClick={() => {
              setParam("stackModal", manager._id);
              fireEscape();
            }}
          >
            <Edit3 /> Edit
          </Button>

          <RtkActionButton
            mutation={useUpdateManagerMutation}
            data={{ id: manager._id, isActive: false }}
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
            mutation={useDeleteManagerMutation}
            data={manager._id}
            primaryText="Delete Manager"
            loadingText="Deleting..."
            variant="destructive"
            onSuccess={(res) => {
              console.log("manager deleted",res);
            }}
          >
            <TrashIcon />
          </RtkActionButton>

        </div>
      </POPOVER>

      <StackModal
        id={manager._id}
        className="bg-accent rounded-2xl _hideScrollbar"
      >
        <TechnicalManagerForm
          existingManager={manager}
          availableRoles={availableRoles}
          className="lg:flex flex-col min-w-[70vw]"
        />
      </StackModal>
    </>
  );
};

export default ManagerActionsPopper;
