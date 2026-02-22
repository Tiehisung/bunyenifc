import HEADER from "@/components/Element";
import { ISelectOptionLV } from "@/types";
import DocumentFolders from "./Folders";
import { DocumentUploader } from "./DocUploader";
import { ConsentForm } from "@/components/pdf/ConsentForm";
import { RecentDocs } from "./RecentDocs";
import TextDivider from "@/components/Divider";
import { useGetFolderMetricsQuery } from "@/services/docs.endpoints";
import { useGetPlayersQuery } from "@/services/player.endpoints";
import Loader from "@/components/loaders/Loader";

export default function DocsPage() {
  const { data: playersData, isLoading: playersLoading } = useGetPlayersQuery('');
  const { data: metricsData, isLoading: metricsLoading } =
    useGetFolderMetricsQuery();

  const isLoading = playersLoading || metricsLoading;
  const players = playersData;
  const folderMetrics = metricsData;

  if (isLoading) {
    return (
      <div>
        <HEADER title="DOCUMENTATION" />
        <main className="_page mt-6 pb-6">
          <div className="flex justify-center items-center min-h-100">
            <Loader message="Loading documents..." />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <HEADER title="DOCUMENTATION" />
      <main className="_page mt-6 pb-6">
        <RecentDocs />

        <section className="space-y-6">
          <DocumentUploader
            className="w-full my-2"
            tagsData={[
              {
                name: "Tag Players",
                options: players?.data?.map((p) => ({
                  label: `${p.firstName} ${p?.lastName}`,
                  value: `${p?.firstName} ${p?.lastName}`,
                })) as ISelectOptionLV[],
              },
            ]}
          />
          <DocumentFolders folderMetrics={folderMetrics} />
        </section>

        <br />

        <TextDivider
          text="GENERATE CONSENT FORMS"
          className="text-Orange my-6"
        />

        <ConsentForm players={players?.data} />
      </main>
    </div>
  );
}
