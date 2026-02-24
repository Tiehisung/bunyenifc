// pages/Home.tsx or pages/index.tsx
import { lazy, Suspense } from "react";

import CardLoader from "@/components/loaders/CardLoader";

import { TechnicalManagement } from "./(landing)/Management";
import { PitchGallery } from "./(landing)/Pitch";
import LandingSquad from "./(landing)/Squad";
import { LiveMatchCard } from "./matches/live/Live";
import HERO from "./(landing)/HeroSection";
import { PageSEO } from "@/utils/PageSEO";
import PlayerStatistics from "./statistics/Statistics";
import LandingPlayers from "./(landing)/Players";
import LandingFixtures from "./matches/(fixturesAndResults)/LandingFixtures";

 

const LandingNewsHeadlines = lazy(() => import("./news/LandingNews"));
 

// Fallback components
const HeroFallback = () => (
  <div className="w-full h-[60vh] bg-linear-to-r from-gray-900 to-gray-800 animate-pulse" />
);

const GridFallback = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[...Array(6)].map((_, i) => (
      <CardLoader key={i} className="h-48 w-full" />
    ))}
  </div>
);

export default function Home() {
  // const { trackPageView } = useAnalytics();

  // Track page view
  // useEffect(() => {
  //   trackPageView("home");
  // }, [trackPageView]);

  return (
    <>
      <PageSEO page="home" />

      <main className="relative md:block space-y-10">
        {/* Hero Section - Critical for LCP */}
        <Suspense fallback={<HeroFallback />}>
          <HERO />
        </Suspense>

        {/* Players Section */}
        <section className="container mx-auto px-4">
          <Suspense fallback={<CardLoader className="h-36 w-40 mx-auto" />}>
            <LandingPlayers />
          </Suspense>
        </section>

        {/* Squad Section */}
        <section className="container mx-auto px-4">
          <Suspense fallback={<CardLoader className="h-36 w-40 mx-auto" />}>
            <LandingSquad />
          </Suspense>
        </section>

        {/* Live Match */}
        <section className="container mx-auto px-4">
          <Suspense fallback={<CardLoader className="h-36 w-40 mx-auto" />}>
            <LiveMatchCard />
          </Suspense>
        </section>

        {/* Fixtures */}
        <section className="container mx-auto px-4">
          <Suspense fallback={<CardLoader className="h-36 w-40 mx-auto" />}>
            <LandingFixtures />
          </Suspense>
        </section>

        {/* News */}
        <section className="container mx-auto px-4">
          <Suspense fallback={<CardLoader className="h-36 w-40 mx-auto" />}>
            <LandingNewsHeadlines />
          </Suspense>
        </section>

        {/* Pitch Gallery - Static, no suspense needed */}
        <section className="container mx-auto px-4">
          <PitchGallery />
        </section>

        {/* Statistics */}
        <section className="container mx-auto px-4">
          <Suspense fallback={<GridFallback />}>
            <PlayerStatistics />
          </Suspense>
        </section>

        {/* Technical Management */}
        <section className="container mx-auto px-4">
          <Suspense fallback={<CardLoader className="h-36 w-40 mx-auto" />}>
            <TechnicalManagement />
          </Suspense>
        </section>
      </main>
    </>
  );
}
