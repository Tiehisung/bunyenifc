import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast } from "@/utils/toast";
import {
  useSignInMutation,
  useSignUpMutation,
} from "@/services/auth.endpoints";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "@/services/user.endpoints";

import { EUserRole, type IUser } from "@/types/user";
import { useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error";

export default function UsersPage() {
  const { data, isLoading } = useGetUsersQuery();

  return (
    <div>
      <NewUser />
      <br />

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {data?.data?.map((u) => (
            <User key={u._id} user={u} />
          ))}
        </div>
      )}

      <br />

      <Login />
    </div>
  );
}

const User = ({ user }: { user: IUser }) => {
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  
  async function handleDelete() {
    try {
      const response = await deleteUser(user._id as string).unwrap();
      if (response.success)
        showToast({
          message: response.message as string,
          type: response?.success ? "success" : "error",
          position: "bottom-center",
        });
      else toast.error(response?.message);
    } catch (error) {
      toast.error("Error deleting user: " + getErrorMessage(error));
    }
  }
  return (
    <div className="flex items-center gap-2 justify-between my-1.5 text-left ">
      <div>
        <p>{user.name}</p>
        <p className="text-xs font-light ">{user.email}</p>
      </div>
      <code className="text-xs border p-0.5 rounded-full">{user.role}</code>
      <Button
        size={"sm"}
        variant={"destructive"}
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
};

export const NewUser = () => {
  const [createUser, { isLoading }] = useSignUpMutation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async () => {
    try {
      const response = await createUser({
        ...form,
        role: form.role as EUserRole,
      }).unwrap();

      if (response.success) {
        setForm({ name: "", email: "", password: "", role: "" });
      }
      showToast({
        message: response.message as string,
        type: response?.success ? "success" : "error",
        position: "bottom-center",
      });
    } catch (error) {
      toast.error("Error creating user: " + getErrorMessage(error));
    }
  };

  return (
    <div className="p-4 space-y-4 text-sm border bg-orange-50/5">
      <h1>REGISTER NEW USER</h1>

      <div>
        <label htmlFor="name">Name:</label>
        <Input
          type="text"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <Input
          type="text"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="pass">Password:</label>
        <Input
          type="text"
          id="pass"
          name="password"
          value={form.password}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="role">Role:</label>
        <select
          id="role"
          name="role"
          onChange={handleChange}
          className="p-2 border rounded-lg block grow w-full"
          value={form.role}
        >
          <option value="">Select Role</option>

          {Object.values(EUserRole).map((r) => (
            <option value={r} key={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <Button onClick={onSubmit} disabled={isLoading}>
        {isLoading ? "Submitting..." : "Create User"}
      </Button>
    </div>
  );
};
export const Login = () => {
  const [login, { isLoading }] = useSignInMutation();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async () => {
    try {
      const response = await login({
        ...form,
      }).unwrap();

      if (response.success) {
        setForm({ email: "", password: "" });
        alert("User logged in successfully");
      } else {
        alert(response.message);
      }
    } catch (error: any) {
      alert("Error creating user: " + (error?.message || "Unknown error"));
    }
  };

  return (
    <div className="p-4 space-y-4 text-sm border bg-orange-50/5">
      <h1>Login </h1>

      <div>
        <label htmlFor="email">Email:</label>
        <Input
          type="text"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="pass">Password:</label>
        <Input
          type="text"
          id="pass"
          name="password"
          value={form.password}
          onChange={handleChange}
        />
      </div>

      <Button onClick={onSubmit} disabled={isLoading}>
        {isLoading ? "Submitting..." : "Login"}
      </Button>
    </div>
  );
};
