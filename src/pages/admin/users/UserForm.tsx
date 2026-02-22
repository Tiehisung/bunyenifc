import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IconInputWithLabel } from "@/components/input/Inputs";
import { EUserRole, IUser } from "../../../types/user";
import { toast } from "sonner";
import { fireDoubleEscape } from "@/hooks/Esc";
import { useUpdateUserMutation } from "@/services/user.endpoints";
import { getErrorMessage } from "@/lib/error";
import { useSignUpMutation } from "@/services/auth.endpoints";
import { PrimarySelect } from "@/components/select/Select";
import { enumToOptions } from "@/lib/select";
import { Button } from "@/components/buttons/Button";

export default function UserForm({ user }: { user?: IUser }) {
  const [createUser] = useSignUpMutation();
  const [updateUser] = useUpdateUserMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit = async (data: CreateUserInput) => {
    try {
      let result;
      if (user) {
        result = await updateUser({
          _id: user._id,
          ...data,
        }).unwrap();
      } else {
        result = await createUser(data).unwrap();
      }

      if (!result.success) {
        toast.warning(result.message || "Failed to create user");
        return;
      }

      reset({ name: "", email: "", password: "", role: EUserRole.ADMIN });
      toast.success(result.message || "User created successfully");
      fireDoubleEscape();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-8 pt-5">
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <IconInputWithLabel
            label="Name"
            error={fieldState.error?.message}
            {...field}
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
            error={fieldState.error?.message}
            {...field}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field, fieldState }) => (
          <IconInputWithLabel
            label="Password"
            type="password"
            error={fieldState.error?.message}
            {...field}
          />
        )}
      />

      <Controller
        control={control}
        name="role"
        render={({ field, fieldState }) => (
          <PrimarySelect
            options={enumToOptions(EUserRole)}
            value={field.value}
            onChange={field.onChange}
            className="border p-2 w-full"
            triggerStyles="grow w-full py-2"
            label={<p className="text-muted-foreground">Role</p>}
            error={fieldState.error?.message}
          />
        )}
      />

      <Button
        primaryText={user ? "Update User" : "Create User"}
        waiting={isSubmitting}
        waitingText={user ? "Updating..." : "Creating..."}
        type="submit"
        className="p-2 grow w-full justify-center"
      />
    </form>
  );
}

export const createUserSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(4, "Minimum 4 characters")
    .optional()
    .refine((val) => !val || val.length >= 4, {
      message: "Password must be at least 4 characters",
    }),
  role: z.nativeEnum(EUserRole),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
