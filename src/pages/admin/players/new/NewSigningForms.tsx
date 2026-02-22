import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/buttons/Button";
import { DateTimeInput, IconInputWithLabel } from "@/components/input/Inputs";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DiveUpwards from "@/components/Animate";
import { EPlayerPosition, IPlayer } from "@/types/player.interface";
import { staticImages } from "@/assets/images";
import ContentShowcaseWrapper from "@/components/ShowcaseWrapper";
import { PrimarySelect } from "@/components/select/Select";
import { Label } from "@/components/ui/label";
import { enumToOptions } from "@/lib/select";
import QuillEditor from "@/components/editor/Quill";
import { getErrorMessage } from "@/lib/error";
import { AvatarUploadWidget } from "@/components/cloudinary/AvatarUploadWidget";
import { useNavigate } from "react-router-dom";
import {
  useCreatePlayerMutation,
  useUpdatePlayerMutation,
} from "@/services/player.endpoints";

// Zod Schemas
const playerManagerSchema = z.object({
  fullname: z.string().min(2, "Manager fullname is required").max(50),
  phone: z
    .string()
    .regex(/^[0-9]{7,15}$/, "Phone must contain only digits (7–15 chars)"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
});

const playerSchema = z.object({
  firstName: z.string().min(2, "First name is required").max(30),
  lastName: z.string().min(2, "Last name is required").max(30),
  about: z.string().max(3000).optional().default(""),
  position: z.enum(EPlayerPosition),
  number: z.coerce.number().positive().min(1).max(99),
  dateSigned: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Date signed must be a valid date",
  }),
  height: z.coerce.number().positive().min(3).max(8),
  phone: z
    .string()
    .regex(/^[0-9]{7,15}$/, "Phone must contain only digits (7–15 chars)"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  dob: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)) && new Date(val) < new Date(), {
      message: "Date of birth must be valid and in the past",
    }),
  avatar: z
    .string()
    .url("Invalid image URL")
    .min(1, "Profile photo is required"),
  manager: playerManagerSchema,
});

type IFormData = z.infer<typeof playerSchema>;

export default function PlayerProfileForm({
  player = null,
}: {
  player?: IPlayer | null;
}) {
  const navigate = useNavigate();
  const [waiting, setWaiting] = useState(false);
  const [createPlayer] = useCreatePlayerMutation();
  const [updatePlayer] = useUpdatePlayerMutation();

  const { control, handleSubmit, reset } = useForm<IFormData>({
    resolver: zodResolver(playerSchema) as Resolver<IFormData>,
    defaultValues: {
      firstName: player?.firstName || "",
      lastName: player?.lastName || "",
      number: Number(player?.number) || 5,
      dateSigned: player?.dateSigned?.split("T")?.[0] || "",
      height: player?.height || 3.5,
      phone: player?.phone || "0211111111",
      about: player?.about || "",
      email: player?.email || "",
      dob: player?.dob?.split("T")?.[0] || "",
      avatar: player?.avatar || "",
      position: player?.position as EPlayerPosition,
      manager: player?.manager
        ? {
            fullname: player.manager.fullname || "",
            phone: player.manager.phone || "0211111111",
          }
        : {
            fullname: "",
            phone: "0211111111",
            email: "",
          },
    },
  });

  const onSubmit = async (data: IFormData) => {
    try {
      setWaiting(true);

      const payload: Partial<IPlayer> = {
        ...data,
        number: String(data.number),
      };

      let result;
      if (player) {
        result = await updatePlayer({ _id: player._id, ...payload }).unwrap();
      } else {
        result = await createPlayer(payload).unwrap();
      }

      if (result.success) {
        toast.success(result.message);
        reset();
        navigate(0);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Error saving player."));
    } finally {
      setWaiting(false);
    }
  };

  const images = Object.values(staticImages);

  return (
    <section className="bg-card _card pt-6 rounded-2xl flex items-start">
      <ContentShowcaseWrapper images={images as string[]}>
        <div className="w-full">
          <h1 className="mb-2 text-teal-600 text-center _title">
            {player ? "Edit Player Profile" : "New Player Signup"}
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="py-6 sm:px-6 flex items-center justify-center gap-y-6 w-full"
          >
            <div className="flex flex-col gap-10 mx-auto grow w-full">
              {/* Avatar Section */}
              <DiveUpwards layoutId="lid1">
                <div className="flex flex-col gap-1 items-center w-full sm:min-w-72">
                  <h2 className="_label">Avatar</h2>
                  <Controller
                    control={control}
                    name="avatar"
                    render={({ field: { value, onChange }, fieldState }) => (
                      <div className="flex flex-col items-center gap-2">
                        <AvatarUploadWidget
                          onUpload={(file) => onChange(file?.secure_url ?? "")}
                          cropping
                          folder="/players/"
                          initialImage={value || staticImages.avatar}
                        />

                        {fieldState.error && (
                          <p className="text-red-500 text-xs">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
              </DiveUpwards>

              {/* Personal Information */}
              <DiveUpwards layoutId="lid2">
                <div className="p-3 grid gap-8 md:min-w-md lg:min-w-lg">
                  <h2 className="_label">PERSONAL INFORMATION</h2>
                  <Controller
                    control={control}
                    name="firstName"
                    render={({ field, fieldState }) => (
                      <IconInputWithLabel
                        label="First Name"
                        {...field}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="lastName"
                    render={({ field, fieldState }) => (
                      <IconInputWithLabel
                        label="Last Name"
                        {...field}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="number"
                    render={({ field, fieldState }) => (
                      <IconInputWithLabel
                        type="number"
                        label="Jersey Number"
                        {...field}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="position"
                    render={({ field, fieldState }) => (
                      <div>
                        <Label className="mb-2 _label">Player Position</Label>
                        <PrimarySelect
                          options={enumToOptions(EPlayerPosition)}
                          value={field.value}
                          onChange={field.onChange}
                          error={fieldState.error?.message}
                          triggerStyles="w-full capitalize"
                          className="capitalize"
                        />
                      </div>
                    )}
                  />
                  <Controller
                    control={control}
                    name="height"
                    render={({ field, fieldState }) => (
                      <IconInputWithLabel
                        type="number"
                        others={{ step: "0.1" }}
                        label="Height (ft)"
                        {...field}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="phone"
                    render={({ field, fieldState }) => (
                      <IconInputWithLabel
                        label="Phone"
                        type="tel"
                        {...field}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="email"
                    render={({ field, fieldState }) => (
                      <IconInputWithLabel
                        label="Email"
                        type="email"
                        {...field}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="dob"
                    render={({ field, fieldState }) => (
                      <DateTimeInput
                        type="date"
                        label="Date of Birth"
                        {...field}
                        error={fieldState.error?.message}
                        value={field.value?.split("T")[0] || ""}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="dateSigned"
                    render={({ field, fieldState }) => (
                      <DateTimeInput
                        type="date"
                        label="Date Signed"
                        {...field}
                        error={fieldState.error?.message}
                        value={field.value?.split("T")[0] || ""}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="about"
                    render={({ field, fieldState }) => (
                      <QuillEditor
                        label="About this Player"
                        value={field.value || ""}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                </div>
              </DiveUpwards>

              {/* Manager Section */}
              <DiveUpwards layoutId="lid3">
                <div className="p-3 grid gap-8 md:min-w-md lg:min-w-lg">
                  <h2 className="_label mb-5 border-b">MANAGER</h2>

                  <Controller
                    control={control}
                    name="manager.fullname"
                    render={({ field, fieldState }) => (
                      <IconInputWithLabel
                        label="Full Name"
                        {...field}
                        error={fieldState.error?.message}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="manager.phone"
                    render={({ field, fieldState }) => (
                      <IconInputWithLabel
                        label="Phone"
                        type="tel"
                        {...field}
                        error={fieldState.error?.message}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="manager.email"
                    render={({ field, fieldState }) => (
                      <IconInputWithLabel
                        label="Email (Optional)"
                        type="email"
                        {...field}
                        value={field.value || ""}
                        error={fieldState.error?.message}
                      />
                    )}
                  />

                  <Button
                    type="submit"
                    waiting={waiting}
                    waitingText="Please wait..."
                    primaryText={player ? "Update Player" : "Create Player"}
                    className="justify-center px-12 h-10 py-1 w-full flex-wrap-reverse"
                  />
                </div>
              </DiveUpwards>
            </div>
          </form>
        </div>
      </ContentShowcaseWrapper>
    </section>
  );
}
