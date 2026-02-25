// components/PersistenceDemo.tsx
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks/store";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/buttons/Button";
import { Input } from "@/components/input/Inputs";
import { logout, setCredentials } from "@/store/slices/auth.slice";

export function PersistenceDemo() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  // Check if state is persisted

  console.log("localStorage:", localStorage.getItem("persist:root"));

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Redux Persist Demo</h1>

      {/* Auth Section */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication State</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded">
            <p>
              <strong>Status:</strong>{" "}
              {auth.isAuthenticated ? "Logged In" : "Logged Out"}
            </p>
            {auth.user && (
              <>
                <p>
                  <strong>User:</strong> {auth.user.name} ({auth.user.email})
                </p>
                <p>
                  <strong>Last Login:</strong> {auth.lastLogin}
                </p>
              </>
            )}
          </div>

          <div className="flex gap-4">
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              name={""}
            />
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name={""}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() =>
                dispatch(
                  setCredentials({
                    user: { id: "1", name, email },
                    token: "fake-jwt-token",
                  }),
                )
              }
            >
              Login
            </Button>
            <Button variant="destructive" onClick={() => dispatch(logout())}>
              Logout
            </Button>
          </div>

          <div>
            <p>Auth persisted: {auth.isAuthenticated ? "Yes" : "No"}</p>
            <p>Token exists: {auth.token ? "Yes" : "No"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Persistence Info */}
      <Card>
        <CardHeader>
          <CardTitle>Persistence Info</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Open DevTools → Application → Local Storage → http://localhost:5173
          </p>
          <p>
            Look for key: <code>persist:root</code>
          </p>
          <p>Make changes and refresh the page - your data will persist!</p>

          <div className="mt-4 p-4 bg-muted rounded">
            <p className="font-mono text-sm">
              {localStorage.getItem("persist:root")?.substring(0, 200)}...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
