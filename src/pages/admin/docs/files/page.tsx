import { getDocs } from "../page";
import { IPageProps, IQueryResponse } from "@/types";
import { IDocFile } from "@/types/doc";
import { buildQueryStringServer, shortText } from "@/lib";
import InfiniteLimitScroller from "@/components/InfiniteScroll";
import { FaFilePdf } from "react-icons/fa6";
import { Color } from "@/styles";
import { formatDate, getTimeAgo } from "@/lib/timeAndDate";
import { PrimarySearch } from "@/components/Search";
import { DocumentActions } from "../[folder]/Actions";
import FileViewer from "@/components/FilePreviewModal";

const AllDocsPage = async ({ searchParams }: IPageProps) => {
  const qs = buildQueryStringServer(await searchParams);

  const docs: IQueryResponse<IDocFile[]> = await getDocs(qs);
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
              placeholder={`Search document`}
              inputStyles="h-8 placeholder:capitalize"
              className="mb-4"
            />
            <ul className="mb-6 space-y-2">
              {!docs?.data || (docs?.data?.length ?? 0) == 0 ? (
                <li className="_label"> No Documents available</li>
              ) : (
                docs?.data?.map((doc, index) => (
                  <li
                    key={index}
                    className={`group relative flex items-center gap-2 px-3 py-3 cursor-pointer active:bg-opacity-50 w-full before:h-6 before:w-1 before:-ml-5 hover:before:bg-primary active:before:scale-y-90 before:transition-all`}
                  >
                    <FileViewer
                      url={doc?.secure_url}
                      title={doc?.description as string}
                      trigger={
                        <div className="flex items-center justify-between flex-wrap grow gap-x-3.5">
                          <p className="flex items-center gap-2.5 line-clamp-1 grow _wordBreak ">
                            <FaFilePdf color={Color.red} />
                            <span className="">
                              {shortText(
                                doc?.name ?? (doc?.original_filename as string)
                              )}
                            </span>
                          </p>
                          <p className="font-light text-sm text-left ml-3  ">
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
            </ul>
          </div>
        )}
      </main>
      <InfiniteLimitScroller pagination={docs?.pagination} />
    </div>
  );
};

export default AllDocsPage;
