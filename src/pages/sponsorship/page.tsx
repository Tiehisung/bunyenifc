import { staticImages } from "@/assets/images";
import HEADER from "@/components/Element";
import SponsorUs from "./SponsorUs";
import MarqueeCarousel from "@/components/carousel/marquee";
import { ICldFileUploadResult } from "@/types/file.interface";
import { useGetSponsorsQuery } from "@/services/sponsor.endpoints";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Helmet } from "react-helmet";
import { teamBnfc } from "@/data/teamBnfc";

export default function SponsorsPage() {
  const { data: sponsorsData, isLoading, error } = useGetSponsorsQuery('');
  const sponsors = sponsorsData;

  if (isLoading) {
    return (
      <div className="">
        <HEADER title="SUPPORT & SPONSORS" />
        <main className="_page p-5 flex justify-center items-center min-h-100">
          <Loader message="Loading sponsors..." />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="">
        <HEADER title="SUPPORT & SPONSORS" />
        <main className="_page p-5">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load sponsors. Please try again later.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Sponsors | {teamBnfc.name}</title>
        <meta
          name="description"
          content={`${teamBnfc.name} official sponsors and partnership opportunities.`}
        />
        <meta
          name="keywords"
          content={`${teamBnfc.name} sponsors, football sponsors, partnership, donations`}
        />

        {/* Open Graph */}
        <meta property="og:title" content={`${teamBnfc.name} Support & Sponsors`} />
        <meta
          property="og:description"
          content={`Meet the official sponsors and supporters of ${teamBnfc.name}.`}
        />
        <meta property="og:image" content={teamBnfc.logo} />
        <meta property="og:site_name" content={teamBnfc.name} />
      </Helmet>

      <div className="">
        <HEADER title="SUPPORT & SPONSORS" />
        <main className="_page p-5">
          <ul className="flex flex-wrap items-center gap-5">
            {sponsors?.data?.map((sponsor) => (
              <li
                className="border-t-4 border-Blue rounded-t h-32 w-32 bg-card flex items-center gap-1 flex-wrap justify-center shadow-xl"
                key={sponsor?._id}
              >
                <div className="flex items-center gap-1 flex-wrap justify-center">
                  <img
                    src={sponsor?.logo ?? staticImages.ball}
                    alt={sponsor?.name}
                    className="w-14 h-14 object-contain"
                  />
                  <span className="text-xs text-center">{sponsor?.name}</span>
                </div>
              </li>
            ))}
          </ul>

          <MarqueeCarousel>
            {sponsors?.data?.map((sponsor) => (
              <div
                className="border-t-4 border-Blue rounded-t h-32 w-fit px-5 bg-card flex items-center gap-1 flex-wrap justify-center shadow-xl mx-2"
                key={sponsor?._id}
              >
                <div className="flex items-center gap-1 flex-wrap justify-center">
                  <img
                    src={sponsor?.logo ?? staticImages.ball}
                    alt={sponsor?.name}
                    className="w-14 h-14 object-contain"
                  />
                  <span className="text-sm">{sponsor?.name}</span>
                </div>
              </div>
            ))}
          </MarqueeCarousel>

          <br />

          <SponsorUs />
        </main>
      </div>
    </>
  );
}

export interface ISponsorProps {
  _id: string;
  badges: number;
  logo: string;
  businessName: string;
  businessDescription: string;
  name: string;
  phone: string;
  donations?: IDonation[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IDonation {
  _id: string;
  item: string;
  description: string;
  files: ICldFileUploadResult[];
  sponsor: ISponsorProps;
  createdAt?: string;
  updatedAt?: string;
}
