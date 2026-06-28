import { useParams } from "react-router-dom";
import { useGetListingQuery } from "@/services/listingsApi";
import ListingForm from "../create/ListingForm";

const EditListingPage = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const { data } = useGetListingQuery(listingId!);
  return (
    <div>
      <ListingForm existingListing={data?.data} />
    </div>
  );
};

export default EditListingPage;
