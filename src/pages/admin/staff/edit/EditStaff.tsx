import HEADER from "@/components/Element";
import StaffForm from "../StaffForm";
import { useGetStaffMemberQuery } from "@/services/staff.endpoints";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loader from "@/components/loaders/Loader";
import DataErrorAlert from "@/components/error/DataError";

const EditStaffPage = () => {
  const [sp] = useSearchParams();
  const staffId = sp.get("staffId");
  const navigate = useNavigate();

  console.log(staffId);

  const { data, isLoading, error, refetch } = useGetStaffMemberQuery(staffId!);
  if (isLoading) return <Loader />;

  if (error || !data) {
    return (
      <div className="min-h-screen p-6">
        <DataErrorAlert message={error} onRefetch={() => refetch()} />
      </div>
    );
  }
  return (
    <div>
      <HEADER title="EDIT STAFF" />
      <br />
      <StaffForm
        className="_page"
        existingStaff={data?.data}
        onSuccess={() => navigate(-1)}
      />
    </div>
  );
};

export default EditStaffPage;
