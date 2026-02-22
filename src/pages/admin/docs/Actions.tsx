"use client";

import { ConfirmActionButton } from "@/components/buttons/ConfirmAction";
import { PrimaryDropdown } from "@/components/Dropdown";
import { Edit } from "lucide-react";
import { MdOutlineDelete } from "react-icons/md";
import { DIALOG } from "@/components/Dialog";
import { FolderForm } from "./FolderForm";
import { IFolderMetrics } from "@/types/doc";
import { useDeleteFolderMutation } from "@/services/docs.endpoints";

interface IProps {
  folder?: IFolderMetrics;
}

export function FolderActions({ folder }: IProps) {
  const [deleteFolder, { isLoading }] = useDeleteFolderMutation();

  const handleDelete = async () => {
    if (!folder?._id) return;
    await deleteFolder(folder._id);
  };
  return (
    <PrimaryDropdown id={folder?._id} className="grid gap-1.5 p-4">
      <DIALOG
        trigger={
          <>
            <Edit className="text-muted-foreground" /> Edit
          </>
        }
        triggerStyles="justify-start"
        title={<p>Edit folder - {folder?.name}</p>}
        escapeOnClose
        variant={"ghost"}
      >
        <FolderForm folder={folder} />
      </DIALOG>

      <ConfirmActionButton
        primaryText="Delete"
        trigger={
          <>
            <MdOutlineDelete size={24} /> Delete
          </>
        }
        triggerStyles={"justify-start"}
        title="Delete Folder"
        variant={"ghost"}
        confirmVariant="delete"
        confirmText={`Are you sure you want to delete ${folder?.name}? ${
          (folder?.docsCount ?? folder?.documents?.length ?? 0) > 0
            ? `${folder?.docsCount} file${
                folder?.docsCount !== 1 ? "s" : ""
              } in this folder will be deleted as well!`
            : ""
        } `}
        escapeOnEnd
        disabled={folder?.isDefault}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </PrimaryDropdown>
  );
}
