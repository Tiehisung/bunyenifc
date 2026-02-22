import InfiniteLimitScroller from "@/components/InfiniteScroll";
import { formatDate, getTimeAgo } from "@/lib/timeAndDate";
import { IQueryResponse } from "@/types";
import { FaFilePdf } from "react-icons/fa";
import { DragAndDropUpload } from "../../../../components/DragAndDrop";
import { useParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { IDocFile } from "@/types/doc";
import { DocumentActions } from "./Actions";
import { useCreateDocumentMutation } from "@/services/docs.endpoints";

interface IProps {
  docs?: IQueryResponse<IDocFile[]>;
}

export default function FolderDocuments({ docs }: IProps) {
  const { folder } = useParams<{ folder: string }>();

  const [createDocument] = useCreateDocumentMutation();

  const isMobile = useIsMobile("sm");

  const handleFileUpload = async (file: any) => {
    try {
      await createDocument({
        ...file,
        format: "pdf",
        folder: folder,
      }).unwrap();
    } catch (error) {
      console.error("Failed to upload document:", error);
    }
  };

  return (
    <div>
      <main className="pb-7">
        <DragAndDropUpload onChange={handleFileUpload} fileType={"pdf"}>
          <ul className="flex items-start flex-wrap gap-3 border border-border/60 rounded-2xl p-5 grow">
            {docs?.data?.map((docFile, index) => {
              if (isMobile) {
                return (
                  <li
                    key={docFile._id || index}
                    className="group p-2 overflow-hidden hover:ring relative select-auto grow"
                  >
                    <div className="flex items-center">
                      <div className="relative pb-1">
                        <FaFilePdf className="text-Red" size={50} />
                      </div>

                      <div>
                        <p className="text-sm capitalize font-semibold line-clamp-2">
                          {(docFile.name ?? docFile?.original_filename)
                            ?.replaceAll("-", " ")
                            ?.replaceAll("_", " ")}
                        </p>

                        <div className="text-muted-foreground flex flex-wrap items-center">
                          <span>
                            {formatDate(docFile.createdAt, "March 2, 2025")}
                          </span>
                          <span className="bg-secondary rounded-full px-1 text-xs">
                            ({getTimeAgo(docFile.createdAt as string)})
                          </span>
                        </div>
                      </div>
                    </div>
                    <DocumentActions document={docFile} />
                  </li>
                );
              }

              return (
                <li
                  key={docFile._id || index}
                  className="group p-2 overflow-hidden hover:ring relative select-auto"
                >
                  <div className="w-32 flex flex-col justify-center items-center">
                    <div className="relative pb-1">
                      <FaFilePdf className="text-Red" size={50} />
                    </div>
                    <span className="text-sm capitalize font-semibold text line-clamp-2 text-center">
                      {(docFile.name ?? docFile?.original_filename)
                        ?.replaceAll("-", " ")
                        ?.replaceAll("_", " ")}
                    </span>

                    <div className="text-muted-foreground flex flex-wrap items-center justify-center">
                      <span>
                        {formatDate(docFile.createdAt, "March 2, 2025")}
                      </span>
                      <span className="bg-secondary rounded-full px-1 text-xs">
                        ({getTimeAgo(docFile.createdAt as string)})
                      </span>
                    </div>
                  </div>
                  <DocumentActions document={docFile} />
                </li>
              );
            })}
          </ul>
        </DragAndDropUpload>

        <InfiniteLimitScroller
          pagination={docs?.pagination}
          endDataText="No more files"
        />
      </main>
    </div>
  );
}
