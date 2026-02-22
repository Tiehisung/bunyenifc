import { Button } from "@/components/buttons/Button";
import { IconInputWithLabel } from "@/components/input/Inputs";
import { SWITCH } from "@/components/ui/switch";
import { useAction } from "@/hooks/action";
import { apiConfig } from "@/lib/configs";
import { IFolderMetrics } from "@/types/doc";
import { EUserRole } from "@/types/user";
import { useState } from "react";

// Dummy user for testing
import { dummyUser } from "@/data/user"; // Assuming this has { id, name, email, role }

export function FolderForm({ folder }: { folder?: IFolderMetrics }) {
  const [nameError, setNameError] = useState("");

  const [formdata, setFormdata] = useState({
    name: folder?.name || "",
    description: folder?.description || "",
    isDefault: folder?.isDefault || false,
  });

  const { handleAction, isLoading, error: respError } = useAction();

  // Using dummy user instead of session
  const user = dummyUser;
  const isSuperAdmin = user?.role === EUserRole.SUPER_ADMIN;

  return (
    <div className="sm:max-w-lg space-y-8 pt-6">
      <IconInputWithLabel
        label="New Folder Name"
        error={nameError}
        onChange={(e) => {
          setFormdata({ ...formdata, name: e.target.value });
          if (e.target.value.trim()) setNameError("");
        }}
        name="name"
        value={formdata.name}
      />
      <IconInputWithLabel
        label="Description"
        onChange={(e) =>
          setFormdata({ ...formdata, description: e.target.value })
        }
        name="description"
        value={formdata.description}
      />

      <SWITCH
        onCheckedChange={(b) => setFormdata((p) => ({ ...p, isDefault: b }))}
        disabled={!isSuperAdmin}
        checked={formdata.isDefault}
        label="System default"
      />

      <Button
        onClick={() => {
          if (!formdata.name?.trim()) {
            setNameError("Folder name is required");
            return;
          }
          handleAction({
            method: folder ? "PUT" : "POST",
            uri: `${apiConfig.docs}/folders${folder ? `/folder?folderId=${folder._id}` : ""}`,
            body: formdata,
          }).then(() => {
            if (!folder) {
              setFormdata({ name: "", description: "", isDefault: false });
            }
          });
        }}
        primaryText={folder ? "Update Folder" : "Create Folder"}
        waiting={isLoading}
        waitingText={folder ? "Updating..." : "Creating..."}
        className="w-full"
      />

      {respError && <p className="text-red-500 mt-2">{respError}</p>}
    </div>
  );
}
