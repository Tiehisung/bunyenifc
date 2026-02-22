import { SearchX } from "lucide-react";

import { useEffect } from "react";
 
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function NotFound() {
  const {pathname} = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate(-1);
    }, 5000); // Redirect after 5 seconds

    return () => clearTimeout(redirectTimer);
  }, [pathname]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-accent px-6 text-center">
      <div className="flex flex-col items-center space-y-6">
        <SearchX className="w-20 h-20 text-muted-foreground" />

        <h1 className="text-4xl font-bold text-muted-foreground">
          Page Not Resolved
        </h1>

        <p className="text-muted-foreground max-w-md">
          The page you're looking for can not be resolved at the moment.
        </p>

        <Link
          to="/"
          className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition"
        >
          Go Back Home
        </Link>
      </div>
    </main>
  );
}
