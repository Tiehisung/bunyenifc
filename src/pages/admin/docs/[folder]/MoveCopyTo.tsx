"use client";

import { COMBOBOX } from "@/components/ComboBox";
import { DIALOG } from "@/components/Dialog";
import { Badge } from "@/components/ui/badge";
import { ActionButton } from "@/components/buttons/ActionButton";
import { apiConfig } from "@/lib/configs";
import { ReactNode, useState } from "react";
import { useFetch } from "@/hooks/fetch";
import { IDocFile, IFolderMetrics } from "@/types/doc";

interface IProps {
  document?: IDocFile;
  actionType: "Move" | "Copy";
  trigger: ReactNode;
}
export function DocMoveOrCopyTo({ document, actionType, trigger }: IProps) {
  const { loading: fetchingFolders, results: folderMetrics } = useFetch<{
    folders: IFolderMetrics[];
  }>({
    uri: `${apiConfig.docs}/metrics`,
  });

  const [destinationFolder, setDestinationFolder] = useState("");

  return (
    <DIALOG
      trigger={trigger}
      variant={"ghost"}
      triggerStyles="w-full justify-start font-normal"
    >
      <div className="flex flex-col gap-3 justify-center items-center">
        <div>
          {actionType}
          <Badge variant={"secondary"}>
            {document?.name ?? document?.original_filename}
          </Badge>
          to{" "}
        </div>
        <COMBOBOX
          options={
            folderMetrics?.data?.folders
              ?.filter((f) => f?.name !== document?.folder) //Exclude the source folder
              ?.map((f) => ({
                label: f.name,
                value: f.name,
              })) ?? []
          }
          onChange={(op) => setDestinationFolder(op.value)}
          className="min-w-60 "
          isLoading={fetchingFolders}
        />

        <ActionButton
          method="PUT"
          body={
            { actionType, file: document, destinationFolder }  
          }
          escapeOnEnd
          uri={apiConfig.moveCopyDoc}
          primaryText={actionType.toUpperCase()}
          className="justify-center min-w-60"
          disabled={!destinationFolder}
        />
      </div>
    </DIALOG>
  );
}
