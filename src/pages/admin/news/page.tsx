import AdminNews from "./News";
import { NewsForm } from "./NewsForm";
import { useSearchParams } from "react-router-dom";
import { useGetNewsQuery } from "@/services/news.endpoints";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AdminNewsPage = () => {
  const [searchParams] = useSearchParams();
  const paramsString = searchParams.toString();
 
console.log(paramsString)
  const {
    data: news,
    isLoading,
    error,
    isFetching,
  } = useGetNewsQuery({});

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
      <h1 className="_title px-6 text-primaryRed uppercase">News Publisher</h1>
      <NewsForm />
      <AdminNews news={news } />

      {isFetching && (
        <div className="fixed bottom-4 right-4">
          <Loader size="sm" message="Updating..." />
        </div>
      )}
    </div>
  );
};

export default AdminNewsPage;
