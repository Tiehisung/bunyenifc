import TextDivider from "@/components/Divider";
import { Color } from "@/styles";
import { FaFilePdf } from "react-icons/fa";
import Loader from "@/components/loaders/Loader";
import { getTimeAgo } from "@/lib/timeAndDate";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import FileViewer from "@/components/FilePreviewModal";
import { DocumentActions } from "./[folder]/Actions";
import { shortText } from "@/lib";
import { useGetDocumentsQuery } from "@/services/docs.endpoints";
import { formatError } from "@/lib/error";
 

export function RecentDocs() {
  // Use the query hook instead of server-side fetch
  const {
    data: recentDocs,
    isLoading,
    error,
  } = useGetDocumentsQuery("?limit=5");

  if (isLoading) {
    return (
      <div>
        <header className="items-center justify-between mb-4">
          <TextDivider
            text="RECENT DOCUMENTS"
            className="text-xs font-light grow"
          />
        </header>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <header className="items-center justify-between mb-4">
          <TextDivider
            text="RECENT DOCUMENTS"
            className="text-xs font-light grow"
          />
        </header>
        <p className="text-red-500 text-center py-4">
          Error loading documents: {formatError(error)}
        </p>
      </div>
    );
  }

  return (
    <div>
      <header className="items-center justify-between mb-4">
        <TextDivider
          text="RECENT DOCUMENTS"
          className="text-xs font-light grow"
        />
      </header>
      <main>
        {!recentDocs ? (
          <Loader />
        ) : (
          <ul className="mb-6 space-y-2 divide-y">
            {!recentDocs?.data || (recentDocs?.data?.length ?? 0) === 0 ? (
              <li className="_label">No Documents available</li>
            ) : (
              recentDocs?.data?.map((doc, index) => (
                <li
                  key={doc._id || index}
                  className={`group relative flex items-center gap-2 px-3 py-3 cursor-pointer active:bg-opacity-50 w-full before:h-6 before:w-1 before:-ml-5 hover:before:bg-primary active:before:scale-y-90 before:transition-all`}
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
              ))
            )}
            <li className="py-6">
              <Link
                to="/admin/docs/files"
                className="_link border rounded-full py-2 px-5 flex items-center justify-between gap-3"
              >
                View More <ChevronRight />
              </Link>
            </li>
          </ul>
        )}
      </main>
      <br />
    </div>
  );
}
