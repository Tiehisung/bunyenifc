"use client";

import { Button } from "@/components/buttons/Button";
import { PrimaryDropdown } from "@/components/Dropdown";
import { DocMoveOrCopyTo } from "./MoveCopyTo";
import { ConfirmActionButton } from "@/components/buttons/ConfirmAction";
import { icons } from "@/assets/icons/icons";
import { apiConfig } from "@/lib/configs";
import { downloadFile } from "@/lib/file";
import { IDocFile } from "@/types/doc";

export function DocumentActions({ document ,className}: { document?: IDocFile,className?:string }) {
  const docName = document?.name ?? document?.original_filename;
  return (
    <PrimaryDropdown
      id={document?._id}
      triggerStyles={`absolute top-1 right-1 md:invisible group-hover:visible ${className}`}
    >
      <ul>
        <li tabIndex={0}>
          <Button
            onClick={() => {
              downloadFile(document?.secure_url as string, docName as string);
            }}
            className="justify-start w-full font-normal"
            variant={"ghost"}
          >
            <icons.download className="text-muted-foreground " /> Download
          </Button>
        </li>
        <li tabIndex={0}>
          <DocMoveOrCopyTo
            trigger={
              <>
                <icons.copy className="text-muted-foreground " size={24} /> Copy
                To
              </>
            }
            actionType={"Copy"}
            document={document}
          />
        </li>
        <li tabIndex={0}>
          <DocMoveOrCopyTo
            trigger={
              <>
                <icons.move className="text-muted-foreground " size={24} /> Move
                To
              </>
            }
            actionType={"Move"}
            document={document}
          />
        </li>
        <li tabIndex={0}>
          <ConfirmActionButton
            primaryText="Delete"
            trigger={
              <>
                <icons.trash size={24} /> Delete
              </>
            }
            triggerStyles="justify-start w-full"
            uri={`${apiConfig.docs}`}
            body={document}
            method={"DELETE"}
            escapeOnEnd
            variant="destructive"
            confirmVariant={"delete"}
            title="Delete Document"
            confirmText={`Are you sure you want to delete <b>"${docName}"</b>?`}
          />
        </li>
      </ul>
    </PrimaryDropdown>
  );
}
