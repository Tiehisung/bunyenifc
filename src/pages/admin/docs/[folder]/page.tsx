import { ISelectOptionLV } from "@/types";
import FolderDocuments from "./DocsPane";
import { DocumentUploader } from "../DocUploader";
import { Badge } from "@/components/ui/badge";
import { PrimarySearch } from "@/components/Search";

import { useParams, useSearchParams } from "react-router-dom";
import { useGetDocumentsByFolderNameQuery } from "@/services/docs.endpoints";
import Loader from "@/components/loaders/Loader";
import { useGetPlayersQuery } from "@/services/player.endpoints";

export default function FolderPage() {
  const { folder } = useParams<{ folder: string }>();
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString()
    ? `?${searchParams.toString()}`
    : "";

  const folderName = decodeURIComponent(folder || "");

  // Fetch documents for this folder
  const {
    data: docs,
    isLoading: docsLoading,
    error: docsError,
  } = useGetDocumentsByFolderNameQuery({
    folderName,
    queryString,
  });

  // Fetch players for tagging
  const { data: players, isLoading: playersLoading } = useGetPlayersQuery('');

  if (docsLoading || playersLoading) {
    return (
      <div className="_page px-4 flex justify-center items-center min-h-100">
        <Loader message="Loading folder contents..." />
      </div>
    );
  }

  if (docsError) {
    return (
      <div className="_page px-4">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          Error loading documents: {(docsError as any).message}
        </div>
      </div>
    );
  }

  return (
    <div className="_page px-4">
      <header className="flex items-center justify-between gap-4 my-3.5">
        <DocumentUploader
          className="w-fit my-2"
          tagsData={[
            {
              name: "Players",
              options: players?.data?.map((p) => ({
                label: `${p.firstName} ${p?.lastName}`,
                value: `${p?.firstName} ${p?.lastName}`,
              })) as ISelectOptionLV[],
            },
          ]}
          defaultFolder={folderName}
        />
        <div className="flex items-center text-sm gap-0.5">
          <span>{docs?.pagination?.page}</span> of
          <span>{docs?.pagination?.pages}</span>
          <Badge>{docs?.pagination?.total}</Badge>
        </div>
      </header>

      <PrimarySearch
        type="search"
        datalist={(players?.data ?? [])?.map(
          (p) => `${p?.firstName} ${p?.lastName}`,
        )}
        listId="docs-search"
        searchKey="doc_search"
        placeholder={`Search ${folderName?.replaceAll("-", " ")}`}
        inputStyles="h-8 placeholder:capitalize"
        className="mb-4"
      />

      <FolderDocuments docs={docs} />
    </div>
  );
}
