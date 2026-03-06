import { Link } from "react-router-dom";
import { RxVideo } from "react-icons/rx";
import { AnimateOnView } from "@/components/Animate/AnimateOnView";
import { useGetNewsQuery } from "@/services/news.endpoints";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const YouMayLike = () => {
  const { data: newsData, isLoading, error } = useGetNewsQuery('');
  const news = newsData;

  if (isLoading) {
    return (
      <div>
        <h1 className="_heading">YOU MAY LIKE</h1>
        <div className="flex justify-center items-center min-h-75">
          <Loader message="Loading news..." />
        </div>
      </div>
    );
  }

  if (error || !news?.data?.length) {
    return (
      <div>
        <h1 className="_heading">YOU MAY LIKE</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No News Available</AlertTitle>
          <AlertDescription>
            There are no related news articles at the moment.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <h1 className="_heading">YOU MAY LIKE</h1>
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-5 gap-y-10 mt-5">
        {news?.data?.slice(0, 6)?.map((item, index) => (
          <AnimateOnView key={item._id} index={index}>
            <Link to={`/news/${item?.slug}`}>
              <div className="w-full overflow-hidden group relative">
                <img
                  src={item?.headline?.image as string}
                  alt={item?.headline.text}
                  className="aspect-4/2 w-full bg-secondary object-cover group-hover:opacity-85 xl:aspect-5/3 group-hover:scale-105 _slowTrans"
                />

                <div>
                  <p className="_p line-clamp-3">{item?.headline?.text}</p>
                </div>
                {item?.headline?.hasVideo && (
                  <RxVideo className="absolute bottom-1 right-1.5 text-primaryRed text-2xl" />
                )}
              </div>
            </Link>
          </AnimateOnView>
        ))}
      </div>
    </div>
  );
};

export default YouMayLike;
