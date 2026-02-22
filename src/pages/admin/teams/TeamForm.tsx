import { Button } from "@/components/buttons/Button";
import { IconInputWithLabel } from "@/components/input/Inputs";
import { Card } from "@/components/ui/card";
import React, { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import { fireDoubleEscape } from "@/hooks/Esc";
import { ITeam } from "@/types/match.interface";
import { getErrorMessage } from "@/lib/error";
import { useNavigate } from "react-router-dom";
import {
  useCreateTeamMutation,
  useUpdateTeamMutation,
} from "@/services/team.endpoints";
import { ImageUploadWidget } from "@/components/cloudinary/AvatarUploadWidget";

export interface IPostTeam {
  name: string;
  community: string;
  alias: string;
  logo: string;
  contact: string;
  contactName: string;
}

export interface IUpdateTeam extends IPostTeam {
  _id: string;
}

interface IProps {
  team?: ITeam;
}

export const TeamForm = ({ team }: IProps) => {
  const navigate = useNavigate();
  const [waiting, setWaiting] = useState(false);
  const [createTeam] = useCreateTeamMutation();
  const [updateTeam] = useUpdateTeamMutation();

  const [formData, setFormData] = useState<IPostTeam>(
    team
      ? {
          name: team.name || "",
          community: team.community || "",
          alias: team.alias || "",
          contact: team.contact || "",
          contactName: team.contactName || "",
          logo: team.logo || "",
        }
      : {
          name: "",
          community: "",
          alias: "",
          contact: "",
          contactName: "",
          logo: "",
        },
  );

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.logo) {
      toast.error("Logo is required");
      return;
    }

    try {
      setWaiting(true);

      let result;
      if (team) {
        result = await updateTeam({
          _id: team._id,
          ...formData,
        }).unwrap();
      } else {
        result = await createTeam(formData).unwrap();
      }

      if (result.success) {
        toast.success(result.message);

        if (!team) {
          setFormData({
            name: "",
            community: "",
            alias: "",
            contact: "",
            logo: "",
            contactName: "",
          });
        }

        fireDoubleEscape();
        navigate(0);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setWaiting(false);
    }
  };

  return (
    <Card className="w-fit p-3 mx-auto grow">
      <h1 className="font-bold text-lg mb-2 text-teal-700 text-center uppercase">
        {team ? `Update ${team?.name}` : "Register New Opponent Team"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="p-4 pt-10 border max-w-md flex flex-col gap-4 gap-y-8 items-center justify-center mx-center w-full grow md:min-w-sm"
      >
        <div className="flex flex-col items-center justify-center gap-2 mx-auto">
          <ImageUploadWidget
            onUpload={(file) =>
              setFormData({ ...formData, logo: file?.secure_url ?? "" })
            }
            initialImage={team?.logo}
            onRemove={() =>
              setFormData({ ...formData, logo: team?.logo || "" })
            }
          />
          {!formData.logo && (
            <p className="text-red-500 text-xs">Logo is required</p>
          )}
        </div>

        <IconInputWithLabel
          name="name"
          value={formData.name}
          onChange={handleOnChange}
          label="Name"
          required
        />

        <IconInputWithLabel
          name="alias"
          value={formData.alias}
          onChange={handleOnChange}
          label="Alias"
          required
        />

        <IconInputWithLabel
          name="community"
          value={formData.community}
          onChange={handleOnChange}
          label="Community"
          required
        />

        <IconInputWithLabel
          name="contactName"
          value={formData.contactName}
          onChange={handleOnChange}
          label="Contact Person Name"
          required
        />

        <IconInputWithLabel
          name="contact"
          type="tel"
          value={formData.contact}
          onChange={handleOnChange}
          label="Contact"
          required
        />

        <Button
          type="submit"
          waiting={waiting}
          disabled={waiting}
          waitingText="Saving..."
          primaryText="SAVE"
          className="_primaryBtn px-3 py-2 w-full mt-2 justify-center"
        />
      </form>
    </Card>
  );
};
