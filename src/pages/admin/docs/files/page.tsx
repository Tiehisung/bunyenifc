import { shortText } from "@/lib";
import InfiniteLimitScroller from "@/components/InfiniteScroll";
import { FaFilePdf } from "react-icons/fa6";
import { Color } from "@/styles";
import { getTimeAgo } from "@/lib/timeAndDate";
import { PrimarySearch } from "@/components/Search";
import { DocumentActions } from "../[folder]/Actions";
import FileViewer from "@/components/FilePreviewModal";
import { useSearchParams } from "react-router-dom";
import { useGetDocumentsQuery } from "@/services/docs.endpoints";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AllDocsPage = () => {
  const [searchParams] = useSearchParams();
  const paramsString = searchParams.toString();

  const { data: docsData, isLoading, error } = useGetDocumentsQuery(paramsString);
  const docs = docsData;

  if (isLoading) {
    return (
      <div className="_page px-4">
        <div className="flex justify-center items-center min-h-100">
          <Loader message="Loading documents..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="_page px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load documents. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="_page px-4">
      <main>
        {!docs?.data?.length ? (
          <p className="_label">No Documents available</p>
        ) : (
          <div>
            <PrimarySearch
              type="search"
              listId="docs-search"
              searchKey="doc_search"
              placeholder="Search document"
              inputStyles="h-8 placeholder:capitalize"
              className="mb-4"
            />
            <ul className="mb-6 space-y-2">
              {docs?.data?.map((doc) => (
                <li
                  key={doc._id}
                  className="group relative flex items-center gap-2 px-3 py-3 cursor-pointer active:bg-opacity-50 w-full before:h-6 before:w-1 before:-ml-5 hover:before:bg-primary active:before:scale-y-90 before:transition-all"
                >
                  <FileViewer
                    url={doc?.secure_url}
                    title={doc?.description as string}
                    trigger={
                      <div className="flex items-center justify-between flex-wrap grow gap-x-3.5">
                        <p className="flex items-center gap-2.5 line-clamp-1 grow _wordBreak">
                          <FaFilePdf color={Color.red} />
                          <span>
                            {shortText(
                              doc?.name ?? (doc?.original_filename as string),
                            )}
                          </span>
                        </p>
                        <p className="font-light text-sm text-left ml-3">
                          {getTimeAgo(doc?.createdAt as string)}
                        </p>
                      </div>
                    }
                    className="px-1 grow max-w-[70vw]"
                  />

                  <DocumentActions
                    document={doc}
                    className="md:visible relative ml-auto"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
      <InfiniteLimitScroller pagination={docs?.pagination} />
    </div>
  );
};

export default AllDocsPage;
