export interface IListing {
    _id: string;
    duplicatedFrom?: string,//may start as duplicate
    seller: { _id: string; fullName: string; phoneNumber: string; town?: string; isVerified: boolean };
    brand: string;
    model?: string;
    year?: number;
    mileage?: number;
    engineCapacity?: number;
    condition: EBikeCondition;
    price: number;
    priceNegotiable: boolean;
    location: string;
    description?: string;
    images: string[];
    hasDocuments: boolean;
    listingType: EListingType
    paymentStatus: EPaymentStatus
    status: EListingStatus
    isPhysicallyVerified: boolean;
    viewCount: number;
    reasonForSelling?: string;
    videoUrl?: string;
    documentType?: EDocumentType;
    documentImage?: string;
    chassisNumber?: string;
    engineNumber?: string;
    listingFee?: number;
    paymentReference?: string;
    adminNotes?: string;
    reviewedBy?: string
    reviewedAt?: Date;
    inspectionId?: string
    inquiryCount: number;
    createdAt: string;
    updatedAt: string;
    expiresAt: string;

    isBoosted: boolean,
    boostType: '7day' | '30day' | null,
    boostExpiresAt: Date,
    boostPurchasedAt: Date,
    boostPaymentReference: string,
}


export enum EBikeCondition {
    Excellent = 'Excellent',
    Good = 'Good',
    Fair = 'Fair',
    NeedsRepair = 'Needs Repair'
}

export enum EDocumentType {
    OriginalRegistration = 'Original Registration',
    DuplicateRegistration = 'Duplicate Registration',
    ReceiptOnly = 'Receipt Only',
    None = 'None',
    Empty = ''
}

export enum EListingType {
    Standard = 'standard',
    Premium = 'premium'
}

export enum EPaymentStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    PAID = 'paid',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

export enum EListingStatus {
    Pending = 'pending',
    Approved = 'approved',
    Rejected = 'rejected',
    Sold = 'sold',
    Expired = 'expired',
}