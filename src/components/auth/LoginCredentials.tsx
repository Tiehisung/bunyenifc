// frontend/src/components/auth/Login.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IconInputWithLabel } from "@/components/input/Inputs";
import { Button } from "@/components/buttons/Button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/store/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function CredentialsLoginForm() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    const result = await login(data);

    const path =
      result?.user?.role == "player"
        ? "/players/dashboard"
        : result?.user?.role?.includes("admin")
          ? "/admin"
          : "";

    if (result.success) {
      navigate(path, { replace: true });
    } else {
      setError(result?.error as string);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-card rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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

        <Button
          type="submit"
          primaryText="Login"
          waiting={isLoading}
          className="w-full"
        />
      </form>

      <p className="mt-4 text-center text-sm">
        Don't have an account?{" "}
        <Link to="/register" className="text-Orange hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
