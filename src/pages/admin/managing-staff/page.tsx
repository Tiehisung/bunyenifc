import TechnicalManagerForm from "./StaffForm";
import { PrimaryCollapsible } from "@/components/Collapsible";
import { Plus } from "lucide-react";
import Header from "../../../components/Element";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AdminManagers from "./DisplayStaff";
import { useGetStaffMembersQuery } from "@/services/staff.endpoints";

const AllManagingStaffPage = () => {
  const {
    data: staffData,
    isLoading: managersLoading,
    error: managersError,
  } = useGetStaffMembersQuery({});

  if (managersLoading) {
    return (
      <div className="_page pb-32 flex justify-center items-center min-h-100">
        <Loader message="Loading technical managers..." />
      </div>
    );
  }

  if (managersError) {
    return (
      <div className="_page pb-32">
        <Header
          title="Technical Management"
          subtitle="Staff and Managing Personnel"
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load managers:{" "}
            {(managersError as any)?.message || "Unknown error"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="_page pb-32">
      <Header
        title="Technical Management"
        subtitle="Staff and Managing Personnel"
      />
      <AdminManagers staffMembers={staffData?.data || []} />
      <PrimaryCollapsible
        header={{
          label: (
            <span
              className="rounded p-2 flex items-center hover:opacity-90 justify-center"
              title="Add Manager"
            >
              <Plus size={40} /> Add Manager
            </span>
          ),
          className: "border",
        }}
      >
        <TechnicalManagerForm />
      </PrimaryCollapsible>

      <br />
    </div>
  );
};

export default AllManagingStaffPage;
