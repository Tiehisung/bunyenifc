import TechnicalManagerForm from "./ManagerForm";
import { PrimaryCollapsible } from "@/components/Collapsible";
import { Plus } from "lucide-react";
import Header from "../../../components/Element";
 
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IFeature, useGetFeatureByNameQuery } from "@/services/feature.endpoints";
import { useGetManagersQuery } from "@/services/manager.endpoints";
import AdminManagers from "./DisplayManagers";
import { ISelectOptionLV } from "@/types";

export interface IManager {
  email: string;
  dob: string;
  _id: string;
  avatar: string;
  role: string;
  fullname: string;
  dateSigned: string;
  phone: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

const TechnicalManagersPage = () => {
  const {
    data: managersData,
    isLoading: managersLoading,
    error: managersError,
  } = useGetManagersQuery({});

  const { data: rolesData, isLoading: rolesLoading } = useGetFeatureByNameQuery(
    "technical management",
  );

  const isLoading = managersLoading || rolesLoading;
  const managers = managersData;
  const roles = rolesData?.data;

  if (isLoading) {
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
      <AdminManagers
        managers={managers?.data}
        roles={roles as IFeature<ISelectOptionLV[]>}
      />
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
        <TechnicalManagerForm
          availableRoles={roles?.data as ISelectOptionLV[]}
        />
      </PrimaryCollapsible>

      <br />
    </div>
  );
};

export default TechnicalManagersPage;
