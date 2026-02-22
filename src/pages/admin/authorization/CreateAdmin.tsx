 

import { DateTimeInput, IconInputWithLabel } from "@/components/input/Inputs";
import React, { ChangeEvent, useState } from "react";
import Select from "react-select";
import { customStyles } from "@/styles";
import { IQueryResponse, ISelectOptionLV } from "@/types";
 
import { FcCamera } from "react-icons/fc";
import { staticImages } from "@/assets/images";
import { toast } from "sonner";
import { apiConfig } from "@/lib/configs";
import { Button } from "@/components/buttons/Button";
import { IUser } from "@/types/user";
import { IFileProps } from "@/types/file.interface";
import { getErrorMessage } from "@/lib/error";
import { useNavigate } from "react-router-dom";
import { getFilePath } from "@/lib/file";

const CreateAdmin = ({ existingUser }: { existingUser?: IUser }) => {
  const navigate = useNavigate();
  const [waiting, setWaiting] = useState(false);
  const [formData, setFormData] = useState<Partial<IUser>>(existingUser ?? {});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: value,
    }));
  };

  const [fileToUpload, setFileToUpload] = useState<string | null>(null);

  async function handleImageSelection(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (!selectedFile) return;
    if (selectedFile.size > 3524000) {
      toast.error(
        `${selectedFile.size} is too large. Picture should not exceed 3.5mb`
      );
      return;
    }
    setFileToUpload(await getFilePath(selectedFile));
  }
  //Handle submit
  const handleCreateAdminUser = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setWaiting(true);

      //Upload image if selected
      let uploadedImage: IFileProps | null = null;
      if (fileToUpload) {
        const upload = await fetch(apiConfig.fileUpload, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: (formData?.name ?? "").replaceAll(" ", "_"),
            path: fileToUpload,
            type: "image",
            folder: `admins/${formData.name?.replaceAll(
              " ",
              "-"
            )}_${new Date().getFullYear()}`,
          }),
        });
        const uploadResult: IQueryResponse<IFileProps> = await upload.json();

        if (!uploadResult.success || !uploadResult.data) {
          setWaiting(false);
          toast.error(uploadResult.message);
          return;
        }

        uploadedImage = uploadResult.data;
      }

      //Proceed to save to database
      if (existingUser) delete formData.password;

      const body = uploadedImage
        ? { ...formData, image: uploadedImage.secure_url }
        : formData;

      const apiRoute = existingUser
        ? `${apiConfig.users}/${existingUser?._id}`
        : apiConfig.users;
      const response = await fetch(apiRoute, {
        body: JSON.stringify(body),
        cache: "no-cache",
        method: existingUser ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
      });
      const results = await response.json();

      if (results.success) {
        toast.success(results.message);
        const formEl = document.getElementById("admin-form") as HTMLFormElement;

        formEl.reset();
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      navigate(0);
      setWaiting(false);
    }
  };
  return (
    <form
      id="admin-form"
      className="grid gap-8"
      onSubmit={handleCreateAdminUser}
    >
      <p className="_label text-teal-800 uppercase italic">
        {existingUser ? "Update " + existingUser.name : "Create new admin"}
      </p>
      <IconInputWithLabel
        label="Fullname"
        name="name"
        value={formData.name}
        type="text"
        onChange={handleChange}
        required
      />
      <IconInputWithLabel
        label="Email"
        name="email"
        value={formData.email}
        type="email"
        onChange={handleChange}
        required
      />
      {!existingUser && (
        <IconInputWithLabel
          label="Password"
          name="password"
          value={formData.password}
          type="password"
          onChange={handleChange}
          required
        />
      )}
      <div className="capitalize -top-4">
        <p className="_label ">
          Assigned Role: <strong>{formData.role ?? ""}</strong>
        </p>
        <Select
          options={["admin", "super_admin"].map((r) => ({
            label: r.replace("_", " "),
            value: r,
          }))}
          name="role"
          defaultValue={{
            label: formData.role?.replace("_", " "),
            value: formData.role,
          }}
          required
          placeholder="Select role"
          styles={customStyles}
          onChange={(newValue: unknown) => {
            const e = newValue as ISelectOptionLV;
            setFormData((p) => ({
              ...p,
              role: e.value as IUser["role"],
            }));
          }}
        />
      </div>
      <div>
        <p className="">Date engaged</p>
        <DateTimeInput
          type="date"
          onChange={(e) =>
            setFormData((p) => ({ ...p, dateEngaged: e.target.value }))
          }
          name={existingUser ? "date" + existingUser._id : "dateEngaged"}
          required
          value={formData?.dateEngaged}
          className=" px-2 w-52 sm:w-60 h-7 rounded font-semibold"
        />
      </div>
      <div className="w-fit flex flex-col gap-1 justify-center items-center">
        <img
          src={fileToUpload || existingUser?.image || staticImages.avatar}
          width={300}
          height={300}
          alt="desc image"
          className="h-36 w-36 rounded-xl shadow"
        />
        <label
          htmlFor={existingUser ? "img" + existingUser._id : "new-leader"}
          className="flex items-center shadow w-fit p-1 rounded mt-3 cursor-pointer"
          title="Choose file"
        >
          <FcCamera size={30} /> Choose files
          <input
            id={existingUser ? "img" + existingUser._id : "new-leader"}
            hidden
            type="file"
            onChange={handleImageSelection}
            name="image"
            className=""
            accept="image/*"
          />
        </label>
      </div>

      <Button
        type="submit"
        waiting={waiting}
        waitingText={"Please wait..."}
        disabled={waiting}
        primaryText={"Submit"}
        className="_primaryBtn px-12 h-10 py-1 w-fit mt-4"
      />
    </form>
  );
};

export default CreateAdmin;
