import { ICaptainProps } from "../admin/players/captaincy/Captaincy";

import SimpleCarousel from "@/components/carousel/SimpleCarousel";
import CardCarousel from "@/components/carousel/cards";
import { CgShapeRhombus } from "react-icons/cg";
import { TITLE } from "@/components/Element";
import { GrUserManager } from "react-icons/gr";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGetCaptainsQuery } from "@/services/captain.endpoints";
import { IStaff } from "@/types/staff.interface";
import { useGetStaffMembersQuery } from "@/services/staff.endpoints";

export const TechnicalManagement = () => {
  const {
    data: staffData,
    isLoading: staffLoading,
    error: managersError,
  } = useGetStaffMembersQuery("isActive=true");

  const { data: captainsData, isLoading: captainsLoading } =
    useGetCaptainsQuery("isActive=true");

  const isLoading = staffLoading || captainsLoading;

  if (isLoading) {
    return (
      <div
        id="technical-management"
        className="_page max-w-full overflow-hidden"
      >
        <TITLE icon={<GrUserManager />} text="Technical Management" />
        <div className="flex justify-center items-center min-h-100">
          <Loader message="Loading technical team..." />
        </div>
      </div>
    );
  }

  if (managersError) {
    return (
      <div
        id="technical-management"
        className="_page max-w-full overflow-hidden"
      >
        <TITLE icon={<GrUserManager />} text="Technical Management" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load technical team. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div id="technical-management" className="_page max-w-full overflow-hidden">
      <TITLE icon={<GrUserManager />} text="Technical Management" />
      <div className="flex max-sm:flex-col flex-wrap items-center justify-center gap-8">
        <CardCarousel
          cards={
            captainsData?.data?.map((captain) => (
              <div
                key={captain._id}
                className="flex flex-col justify-center items-center gap-2 pb-6"
              >
                <img
                  src={captain?.player?.avatar as string}
                  alt="desc image"
                  className="h-60 w-full object-cover rounded-xl shadow-md"
                />
                <p className="capitalize">{captain?.role}</p>
                <p className="uppercase">{captain?.player?.name}</p>
              </div>
            )) ?? []
          }
        />

        <CgShapeRhombus size={100} className="animate-pulse" />

        <CardCarousel
          cards={
            staffData?.data?.map((manager: IStaff) => (
              <div
                key={manager._id}
                className="flex flex-col w-fit justify-center items-center gap-2 pb-6"
              >
                <img
                  src={manager?.avatar}
                  alt="desc image"
                  className="h-52 w-52 rounded-full object-cover"
                />
                <p className="font-bold text-lg capitalize">{manager?.role}</p>
                <h2 className="uppercase">{manager?.fullname}</h2>
              </div>
            )) ?? []
          }
          autoplay
        />
      </div>
    </div>
  );
};

export const CaptaincySlides = () => {
  const { data: captainsData, isLoading, error } = useGetCaptainsQuery("");
  const captains = captainsData?.data as ICaptainProps[];

  if (isLoading) {
    return (
      <div id="captaincy" className="_page">
        <TITLE text="Captaincy" />
        <div className="flex justify-center items-center min-h-75">
          <Loader message="Loading captains..." />
        </div>
      </div>
    );
  }

  if (error || !captains?.length) {
    return (
      <div id="captaincy" className="_page">
        <TITLE text="Captaincy" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Captains Found</AlertTitle>
          <AlertDescription>
            There are no captains available at the moment.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div id="captaincy" className="_page">
      <TITLE text="Captaincy" />

      <SimpleCarousel
        wrapperStyles="grow w-fit"
        scrollButtonStyles="top-1/3"
        className="_hideScrollbar"
      >
        {captains?.map((captain) => (
          <div
            key={captain._id}
            className="flex flex-col justify-center items-center gap-2 mb-6"
          >
            <img
              src={captain?.player?.avatar as string}
              alt="desc image"
              className="h-72 w-auto max-w-max rounded-xl shadow-md"
            />
            <p className="text-[grayText] first-letter:uppercase">
              {captain?.role}
            </p>
            <p>{captain?.player?.name ?? "Name"}</p>
          </div>
        ))}
      </SimpleCarousel>
    </div>
  );
};
