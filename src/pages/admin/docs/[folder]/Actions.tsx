import { Button } from "@/components/buttons/Button";
import { PrimaryDropdown } from "@/components/Dropdown";
import { DocMoveOrCopyTo } from "./MoveCopyTo";
import { ConfirmActionButton } from "@/components/buttons/ConfirmAction";
import { icons } from "@/assets/icons/icons";
import { downloadFile } from "@/lib/file";
import { IDocFile } from "@/types/doc";
import { useDeleteDocumentMutation } from "@/services/docs.endpoints";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function DocumentActions({
  document,
  className,
}: {
  document?: IDocFile;
  className?: string;
}) {
  const navigate = useNavigate();
  const [deleteDoc] = useDeleteDocumentMutation();

  const docName = document?.name ?? document?.original_filename;

  const handleDelete = async () => {
    if (!document?._id) return;

    try {
      const result = await deleteDoc(document._id).unwrap();
      if (result.success) {
        toast.success(result.message);
        navigate(0);
      }
    } catch (error) {
      toast.error("Failed to delete document");
    }
  };

  return (
    <PrimaryDropdown
      id={document?._id}
      triggerStyles={`absolute top-1 right-1 md:invisible group-hover:visible ${className || ""}`}
    >
      <ul>
        <li>
          <Button
            onClick={() => {
              downloadFile(document?.secure_url as string, docName as string);
            }}
            className="justify-start w-full font-normal"
            variant="ghost"
          >
            <icons.download className="text-muted-foreground" /> Download
          </Button>
        </li>
        <li>
          <DocMoveOrCopyTo
            trigger={
              <>
                <icons.copy className="text-muted-foreground" size={24} /> Copy
                To
              </>
            }
            actionType="Copy"
            document={document}
          />
        </li>
        <li>
          <DocMoveOrCopyTo
            trigger={
              <>
                <icons.move className="text-muted-foreground" size={24} /> Move
                To
              </>
            }
            actionType="Move"
            document={document}
          />
        </li>
        <li>
          <ConfirmActionButton
            primaryText="Delete"
            trigger={
              <>
                <icons.trash size={24} /> Delete
              </>
            }
            triggerStyles="justify-start w-full"
            onConfirm={handleDelete}
            variant="destructive"
            title="Delete Document"
            confirmText={`Are you sure you want to delete <b>"${docName}"</b>?`}
          />
        </li>
      </ul>
    </PrimaryDropdown>
  );
}
