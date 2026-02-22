import { Suspense } from "react";
import { LatestNews } from "./Latest";
import Skeleton from "react-loading-skeleton";
import YouMayLike from "./YouMayLike";
import { teamBnfc } from "@/data/teamBnfc";
import { Helmet } from "react-helmet";

const NewsPage = () => {
  return (
    <>
      <Helmet>
        <title>Club News | Konjiehi FC</title>
        <meta
          name="description"
          content="Latest news, updates, transfers and announcements from Konjiehi FC."
        />

        {/* Open Graph */}
        <meta property="og:title" content="Konjiehi FC News" />
        <meta
          property="og:description"
          content="Stay informed with the latest club news."
        />
        <meta property="og:url" content={`${teamBnfc.url}/news`} />
        <meta property="og:site_name" content={teamBnfc.name} />
        <meta property="og:image" content={teamBnfc.logo} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Konjiehi FC News" />
        <meta
          name="twitter:description"
          content="Latest news & headlines from Konjiehi FC."
        />
        <meta name="twitter:image" content={teamBnfc.logo} />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsMediaOrganization",
            name: teamBnfc.name,
            logo: teamBnfc.logo,
            url: `${teamBnfc.url}/news`,
          })}
        </script>
      </Helmet>

      <main className="my-5 container _page">
        <section className="space-y-10">
          <Suspense
            fallback={<Skeleton width={300} height="200px" className="" />}
          >
            <LatestNews />
          </Suspense>

          <Suspense
            fallback={<Skeleton width={300} height="200px" className="" />}
          >
            <YouMayLike />
          </Suspense>
        </section>
      </main>
    </>
  );
};

export default NewsPage;
