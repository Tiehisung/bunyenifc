import { IFileProps } from "@/types/file.interface";

export interface IDocFile extends IFileProps {
    format: "pdf" | "image";
    folder: string;
}
export interface IFolder {
    _id: string;
    name: string
    description?: string
    documents?: IDocFile[]
    isDefault?: boolean
    createdAt?: string
    updatedAt?: string
}

export interface IFolderMetrics extends Omit<IFolder, 'documents'> {
    docsCount: number;
    documents: string[]
}

 
