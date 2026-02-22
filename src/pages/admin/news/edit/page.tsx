import { FC } from "react";
import Header from "../../../../components/Element";
import { EditNewsForm } from "./EditNewsForm";
import { useParams } from "react-router-dom";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGetNewsItemQuery } from "@/services/news.endpoints";

const NewsEditingPage: FC = () => {
  const { newsId } = useParams<{ newsId: string }>();

  const {
    data: newsItem,
    isLoading,
    error,
  } = useGetNewsItemQuery(newsId || "");

  if (isLoading) {
    return (
      <div>
        <Header title="Editing news" subtitle="" />
        <div className="flex justify-center items-center min-h-100">
          <Loader message="Loading news item..." />
        </div>
      </div>
    );
  }

  if (error || !newsItem?.data) {
    return (
      <div>
        <Header title="Editing news" subtitle="" />
        <div className="p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load news item:{" "}
              {(error as any)?.message || "News item not found"}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Editing news" subtitle="" />
      <EditNewsForm newsItem={newsItem.data} />
    </div>
  );
};

export default NewsEditingPage;
