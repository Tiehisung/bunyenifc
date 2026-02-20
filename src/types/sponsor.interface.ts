import type { IDonation } from "./donation.interface";

export interface ISponsor {
    _id: string;
    badges: number;
    logo: string;
    businessName: string;
    businessDescription: string;
    name: string;
    phone: string;
    donations?: IDonation[];
    createdAt?: string;
    updatedAt?: string;
}
 