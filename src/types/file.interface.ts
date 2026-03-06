import { IUser } from "./user";

export interface ICloudinaryFile {
    public_id: string;
    resource_type?: "image" | "video" | "raw"
    secure_url: string;
    url: string;
    thumbnail_url?: string;
    format?: string;
    bytes?: number;
    type: string;
    original_filename?: string;
    width?: number;
    height?: number;
    duration?: number;
}

export interface IFileProps extends ICloudinaryFile {
    _id?: string; //Trace any saved file data on db
    name?: string;
    description?: string; //Optional field to save with file on db
    createdAt?: string;
    updatedAt?: string;
}

export interface IGallery {
    _id?: string;
    title?: string;
    description: string;
    files: Array<IFileProps>;
    timestamp?: number;
    type?: 'player' | 'donation' | 'general',
    tags?: string[];
    createdBy?: Partial<IUser>
    createdAt?: string;
    updatedAt?: string;
}