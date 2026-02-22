import { IQueryResponse } from "@/types";
import { FolderForm } from "./FolderForm";

import { FolderActions } from "./Actions";
import { Button } from "@/components/buttons/Button";
import { DIALOG } from "@/components/Dialog";
import { icons } from "@/assets/icons/icons";
import { IFolderMetrics } from "@/types/doc";
import { PiFolderThin } from "react-icons/pi";
import { Link, useLocation } from "react-router-dom";

interface IProps {
  folderMetrics?: IQueryResponse<IFolderMetrics[]>;
}

export default function DocumentFolders({ folderMetrics }: IProps) {
  const { pathname } = useLocation();
  return (
    <div>
      <main className="flex items-start gap-4 ">
        <ul className="grid grid-cols-2 sm:flex flex-wrap items-center justify-start gap-3 border rounded-2xl overflow-hidden w-fit">
          {folderMetrics?.data?.map((f, index) => {
            return (
              <li
                key={index}
                className="flex _hover relative group select-auto sm:w-32 "
              >
                <Link to={`${pathname}/${f?.name}`} className="flex grow p-2">
                  <div className=" flex flex-col justify-center items-center grow ">
                    <PiFolderThin
                      className={`text-Orange/80 text-7xl lg:text-8xl dark:text-Orange ${
                        f?.isDefault
                          ? "text-muted-foreground dark:text-muted-foreground"
                          : ""
                      }`}
                      size={44}
                    />
                    <span className="font-light text-sm text-muted-foreground mx-auto">
                      {f?.docsCount ?? 0} items
                    </span>

                    <span className="text-sm capitalize font-normal text line-clamp-2 text-center h-10 ">
                      {f?.name}
                    </span>
                  </div>
                </Link>
                <div className="absolute right-1 top-1 md:invisible group-hover:visible">
                  <FolderActions folder={f} />
                </div>
              </li>
            );
          })}

          <li>
            <DIALOG
              title={
                <p className="text-2xl font-semibold uppercase text-center">
                  Create New Folder
                </p>
              }
              trigger={
                <Button
                  variant="outline"
                  className="p-2 select-auto h-24 w-24 text-2xl"
                  size="lg"
                >
                  {<icons.new size={32} />}
                </Button>
              }
              variant={"ghost"}
            >
              <FolderForm />
            </DIALOG>
          </li>
        </ul>
      </main>
    </div>
  );
}
