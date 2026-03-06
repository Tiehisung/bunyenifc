import { broadcasters } from "@/assets/broadcaster/broadcaster";
import { Reveal } from "@/components/Animate/Reveal";
import SimpleCarousel from "@/components/carousel/SimpleCarousel";
import { INewsProps } from "@/types/news.interface";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { TITLE } from "@/components/Element";
import { PiNewspaperLight } from "react-icons/pi";
import { useGetNewsQuery } from "@/services/news.endpoints";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const casters = Object.values(broadcasters);

const LandingNewsHeadlines = () => {
  const { data: newsData, isLoading, error } = useGetNewsQuery('');
  const news = newsData;

  if (isLoading) {
    return (
      <div className="_page">
        <TITLE icon={<PiNewspaperLight />} text="News" />
        <div className="flex justify-center items-center min-h-50">
          <Loader message="Loading news..." />
        </div>
      </div>
    );
  }

  if (error || !news?.data?.length) {
    return (
      <div className="_page">
        <TITLE icon={<PiNewspaperLight />} text="News" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No News Available</AlertTitle>
          <AlertDescription>
            There are no news articles at the moment.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="_page">
      <TITLE icon={<PiNewspaperLight />} text="News" />

      <SimpleCarousel className="_hideScrollbar" scrollButtonStyles="top-1/3">
        {news?.data?.map((item, index) => (
          <Link to={`/news/${item.slug}`} key={item._id}>
            <Card className="w-60 sm:max-w-60 max-sm:grow overflow-hidden rounded-none">
              <CardContent>
                <img
                  src={item?.headline?.image as string}
                  alt={item?.headline?.text as string}
                  className="h-44 w-full max-w-60 rounded-badge object-cover min-w-60"
                />
                <img
                  src={
                    (casters[index % casters.length] as string) ?? casters[2]
                  }
                  alt={item?.headline?.text as string}
                  className="h-5 w-auto object-contain my-2"
                />
                <div className="font-semibold line-clamp-2 h-11 max-w-60 overflow-hidden">
                  {item?.headline?.text as string}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </SimpleCarousel>
    </div>
  );
};

export default LandingNewsHeadlines;

export const NewsInPage = ({ news }: { news: INewsProps[] }) => {
  if (!news?.length) {
    return (
      <div className="relative flex items-start gap-2">
        <main className="my-5">
          <p className="text-muted-foreground">No news available</p>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex items-start gap-2">
      <main className="my-5">
        {news?.map((item, index) => {
          return (
            <Reveal
              key={item._id}
              className="grid sm:flex items-start justify-start border-b _borderColor pb-4 mb-6 grow"
            >
              <section className="w-60 max-sm:grow container">
                <img
                  src={item?.headline?.image as string}
                  alt={item?.headline?.text as string}
                  className="h-44 rounded-badge min-w-60 object-cover _secondaryBg"
                />
                <img
                  src={
                    (casters[index % casters.length] as string) ?? casters[2]
                  }
                  alt={item?.headline?.text as string}
                  className="h-5 w-auto object-contain my-2"
                />
                <p className="font-semibold line-clamp-2 h-11 max-w-full">
                  {item?.headline?.text as string}
                </p>
              </section>
            </Reveal>
          );
        })}
      </main>
    </div>
  );
};
