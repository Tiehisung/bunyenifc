import OtherAdminNews from "./OtherNews";
import { SearchAndFilterNews } from "./SearchAndFilter";
import NewsItemClient from "./NewsClient";
import { useParams, useSearchParams } from "react-router-dom";
import {
  useGetNewsItemQuery,
  useGetNewsQuery,
} from "@/services/news.endpoints";
import { Helmet } from "react-helmet";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { teamBnfc } from "@/data/teamBnfc";

export default function NewsItemPage() {
  const { newsId } = useParams<{ newsId: string }>();
  const [searchParams] = useSearchParams();
  const paramsString = searchParams.toString();
  console.log(paramsString)

  const {
    data: newsItemData,
    isLoading: itemLoading,
    error: itemError,
  } = useGetNewsItemQuery(newsId || "");

  const { data: newsData, isLoading: newsLoading } = useGetNewsQuery({});

  const isLoading = itemLoading || newsLoading;
  const newsItem = newsItemData?.data;
  const news = newsData;

  if (isLoading) {
    return (
      <div className="flex max-lg:flex-wrap items-start gap-6 relative pt-6 p-4 md:pl-10">
        <div className="flex justify-center items-center min-h-100 w-full">
          <Loader message="Loading article..." />
        </div>
      </div>
    );
  }

  if (itemError || !newsItem) {
    return (
      <div className="flex max-lg:flex-wrap items-start gap-6 relative pt-6 p-4 md:pl-10">
        <Alert variant="destructive" className="w-full">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load news article. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const title = `bunyenifc - ${newsItem?.headline?.text}`;
  const description =
    newsItem?.details?.find((d) => d.text)?.text ||
    "Read the latest news and updates from bunyenifc.";
  const image = newsItem?.headline?.image || teamBnfc.logo;
  const url = `${teamBnfc.url}/news/${newsId}`;
  const ogImage = image.replace(
    "/upload/",
    "/upload/c_fill,w_1200,h_630,f_auto,q_auto/",
  );

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:site_name" content={teamBnfc.name} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="article" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </Helmet>

      <div className="flex max-lg:flex-wrap items-start gap-6 relative pt-6 p-4 md:pl-10">
        <section className="grow min-w-3/4">
          <NewsItemClient newsItem={newsItem} />
        </section>
        <section className="sticky top-0 pt-4">
          <SearchAndFilterNews />
          <br />
          <OtherAdminNews news={news} />
        </section>
      </div>
    </>
  );
}
