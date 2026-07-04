import { useParams } from "react-router-dom";
import { useGetListingQuery } from "@/services/listingsApi";
import ListingForm from "../create/ListingForm";
import NotifierWrapper from "@/components/Notifier";

const EditListingPage = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const { data } = useGetListingQuery(listingId!);

  const isDuplicate = !!data?.data?.duplicatedFrom;
  return (
    <div>
      {isDuplicate && (
        <NotifierWrapper message={undefined} >
          <p className="text-sm font-medium text-info">
            📋 This is a duplicated listing
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Review the details below, make any changes, and pay the listing fee
            to publish.
          </p>
        </NotifierWrapper>
      )}

      <ListingForm existingListing={data?.data} />
    </div>
  );
};

export default EditListingPage;
