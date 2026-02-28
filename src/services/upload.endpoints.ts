import { IFileProps } from '@/types/file.interface';
import { api } from './api';

// ==================== TYPES ====================

export interface UploadedFile {
    url: string;
    secure_url: string;
    public_id: string;
    format: string;
    width?: number;
    height?: number;
    bytes: number;
    duration?: number; // for videos
    original_name?: string; // for documents
}

export interface UploadResponse {
    success: boolean;
    message: string;
    data: IFileProps;
}

export interface UploadMultipleResponse {
    success: boolean;
    message: string;
    data: UploadedFile[];
}

export interface UploadMixedResponse {
    success: boolean;
    data: {
        avatar?: UploadedFile[];
        gallery?: UploadedFile[];
        video?: UploadedFile[];
        documents?: UploadedFile[];
    };
}

export interface DeleteFileResponse {
    success: boolean;
    message: string;
}

// ==================== UPLOAD ENDPOINTS ====================

export const uploadApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // ========== SINGLE UPLOADS ==========

        /**
         * Upload a single image (avatar, profile pic, etc)
         * @param formData - FormData with field name 'image'
         * @example
         * const formData = new FormData();
         * formData.append('image', file);
         */
        uploadImage: builder.mutation<UploadResponse, FormData>({
            query: (formData) => ({
                url: '/upload/image',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Uploads'],
        }),

        /**
         * Upload a single video (match highlights, etc)
         * @param formData - FormData with field name 'video'
         */
        uploadVideo: builder.mutation<UploadResponse, FormData>({
            query: (formData) => ({
                url: '/upload/video',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Uploads'],
        }),

        /**
         * Upload a document (PDF, etc)
         * @param formData - FormData with field name 'document'
         */
        uploadDocument: builder.mutation<UploadResponse, FormData>({
            query: (formData) => ({
                url: '/upload/document',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Uploads'],
        }),

        // ========== MULTIPLE UPLOADS ==========

        /**
         * Upload multiple images (gallery)
         * @param formData - FormData with field name 'images' (multiple files)
         * @example
         * const formData = new FormData();
         * files.forEach(file => formData.append('images', file));
         */
        uploadGallery: builder.mutation<UploadMultipleResponse, FormData>({
            query: (formData) => ({
                url: '/upload/gallery',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Uploads'],
        }),

        // ========== MIXED UPLOADS ==========

        /**
         * Upload different file types in one request
         * @param formData - FormData with fields:
         *   - 'avatar': single file
         *   - 'gallery': multiple files
         *   - 'video': single video
         */
        uploadMixed: builder.mutation<UploadMixedResponse, FormData>({
            query: (formData) => ({
                url: '/upload/mixed',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Uploads'],
        }),

        // ========== DELETE ==========

        /**
         * Delete a file from Cloudinary
         * @param public_id - The Cloudinary public_id
         * @param resource_type - 'image' | 'video' | 'raw' (default: 'image')
         */
        deleteFile: builder.mutation<DeleteFileResponse, {
            public_id: string;
            resource_type?: 'image' | 'video' | 'raw'
        }>({
            query: ({ public_id, resource_type = 'image' }) => ({
                url: `/upload/${public_id}?resource_type=${resource_type}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Uploads'],
        }),
    }),
});

// ==================== HOOKS EXPORTS ====================

export const {
    // Single upload hooks
    useUploadImageMutation,
    useUploadVideoMutation,
    useUploadDocumentMutation,

    // Multiple upload hooks
    useUploadGalleryMutation,

    // Mixed upload hooks
    useUploadMixedMutation,

    // Delete hook
    useDeleteFileMutation,
} = uploadApi;