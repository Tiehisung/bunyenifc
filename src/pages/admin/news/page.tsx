import AdminNews from "./News";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetNewsQuery } from "@/services/news.endpoints";
import Loader from "@/components/loaders/Loader";
import { AlertCircle, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/buttons/Button";

const AdminNewsPage = () => {
  const [searchParams] = useSearchParams();
  const paramsString = searchParams.toString();

  const { data: news, isLoading, error } = useGetNewsQuery(paramsString);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div>
        <h1 className="_title px-6 text-primaryRed uppercase">
          News Publisher
        </h1>
        <div className="flex justify-center items-center min-h-100">
          <Loader message="Loading news..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="_title px-6 text-primaryRed uppercase">
          News Publisher
        </h1>
        <div className="px-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load news: {(error as any)?.message || "Unknown error"}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header className="flex items-center gap-4 flex-wrap justify-between">
        <h1 className="_title px-6 text-primaryRed uppercase">
          News Publisher{" "}
        </h1>
        <Button onClick={() => navigate("/admin/news/create-news")}>
          <Plus /> Create
        </Button>
      </header>

      <AdminNews news={news} />
    </div>
  );
};

export default AdminNewsPage;
