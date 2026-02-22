// components/SEO/PageSEO.tsx
import { TEAM } from "@/data/teamBnfc";
import { Helmet } from "react-helmet";

interface IPageSEOProps {
  page?:
    | "home"
    | "players"
    | "matches"
    | "news"
    | "gallery"
    | "sponsors"
    | "contact"
    | "admin";
  title?: string;
  description?: string;
  image?: string;
}

const pageConfig = {
  home: {
    title: "Official Website",
    description: `Official website of ${TEAM.name}. Get the latest news, match updates, player profiles, and everything about your favorite team.`,
    keywords: ["football", "soccer", TEAM.name, "Ghana football"],
  },
  players: {
    title: "Players",
    description: `Meet the ${TEAM.name} squad. View player profiles, stats, and career highlights.`,
    keywords: ["players", "squad", "football team", "player stats"],
  },
  matches: {
    title: "Matches & Fixtures",
    description: `Check ${TEAM.name} upcoming fixtures, live scores, and match results.`,
    keywords: ["fixtures", "results", "live scores", "match schedule"],
  },
  news: {
    title: "News",
    description: `Latest news, updates, and announcements from ${TEAM.name}.`,
    keywords: ["football news", "club updates", "transfer news"],
  },
  gallery: {
    title: "Gallery",
    description: `Browse photos and videos from ${TEAM.name} matches, training, and events.`,
    keywords: ["photos", "videos", "match highlights", "gallery"],
  },
  sponsors: {
    title: "Sponsors & Partners",
    description: `Meet the official sponsors and partners supporting ${TEAM.name}.`,
    keywords: ["sponsors", "partners", "supporters", "donations"],
  },
  contact: {
    title: "Contact Us",
    description: `Get in touch with ${TEAM.name}. Contact information for inquiries, sponsorship, and support.`,
    keywords: ["contact", "email", "phone", "location"],
  },
};

export const PageSEO = ({
  page = "home",
  title: customTitle,
  description: customDescription,
  image,
}: IPageSEOProps) => {
  const config = pageConfig[page as keyof typeof pageConfig];
  const title = customTitle || config.title;
  const description = customDescription || config.description;
  const fullTitle = `${title} | ${TEAM.name}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={config.keywords.join(", ")} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || TEAM.logo} />
      <meta property="og:site_name" content={TEAM.name} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || TEAM.logo} />

      <link
        rel="canonical"
        href={`${TEAM.website.url}/${page === "home" ? "" : page}`}
      />
    </Helmet>
  );
};
