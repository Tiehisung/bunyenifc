import Breadcrumbs from "@/components/Breadcrumbs";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";

const NewsLayout: FC = () => {
  return (
    <>
      <Helmet>
        <title>News | bunyenifc</title>
        <meta
          name="description"
          content="Latest bunyenifc news, press releases, and club announcements."
        />
        <meta
          name="keywords"
          content="bunyenifc news, football updates, club news"
        />

        {/* Open Graph */}
        <meta property="og:title" content="Latest News – bunyenifc" />
        <meta
          property="og:description"
          content="Stay updated on player news, transfers, and club announcements."
        />
        <meta property="og:image" content="/bnfc.png" />
      </Helmet>

      <div className="pt-10 md:pt-20">
        <main className="relative grow">
          <div className="">
            <Breadcrumbs />
          </div>
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default NewsLayout;
