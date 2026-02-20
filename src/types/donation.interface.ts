import type { ICldFileUploadResult } from "./file.interface";
import type { ISponsor } from "./sponsor.interface";



export interface IDonation {
    _id: string;
    item: string;
    description: string;
    files: ICldFileUploadResult[];
    sponsor: ISponsor;
    createdAt?: string;
    updatedAt?: string;
}
