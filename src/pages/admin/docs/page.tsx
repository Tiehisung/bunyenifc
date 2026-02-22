import HEADER from "@/components/Element";
import { getPlayers } from "../players/page";
import { IQueryResponse, ISelectOptionLV } from "@/types";
import { IPlayer } from "@/types/player.interface";
import DocumentFolders from "./Folders";
import { DocumentUploader } from "./DocUploader";
import { ConsentForm } from "@/components/pdf/ConsentForm";
import { RecentDocs } from "./RecentDocs";
import TextDivider from "@/components/Divider";
import { useGetFolderMetricsQuery } from "@/services/docs.endpoints";

export default async function DocsPage() {
  const players: IQueryResponse<IPlayer[]> = await getPlayers();

  const { currentData, isLoading } = useGetFolderMetricsQuery();
  console.log(currentData, isLoading);

  return (
    <div>
      <HEADER title="DOCUMENTATION " />
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
          <DocumentFolders
            folderMetrics={{
              data: { folders: [], totalDocs: 9 },
              success: true,
            }}
          />
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
