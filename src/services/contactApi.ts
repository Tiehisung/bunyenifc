import { IQueryResponse } from '@/types';
import { api } from './_api';

export interface IContactFormData {
    fullName: string;
    phoneNumber: string;
    email?: string;
    inquiryType: string;
    message?: string;
}
export interface IContactMessage {
    _id: string;
    fullName: string;
    phoneNumber: string;
    email?: string;
    message?: string;
    inquiryType: `${EInquiryType}`;
    status: `${EMessageStatus}`;
    category: `${EMessageCategory}`;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export enum EMessageStatus {
    UNREAD = 'unread',
    READ = 'read',
}

export enum EMessageCategory {
    STARRED = 'starred',
    IMPORTANT = 'important',
    SPAM = 'spam',
    ARCHIVED = 'archived',
}

export enum EInquiryType {
    BUYING = 'buying',
    SELLING = 'selling',
    VERIFICATION = 'verification',
    PAYMENT = 'payment',
    LISTING = 'listing',
    PARTNERSHIP = 'partnership',
    OTHER = 'other',
}

export const contactApi = api.injectEndpoints({
    endpoints: (builder) => ({
        submitContact: builder.mutation<IQueryResponse<{
            id: string;
            fullName: string;
            inquiryType: string;
            createdAt: string;
        }>, IContactFormData>({
            query: (body) => ({
                url: '/contacts',
                method: 'POST',
                body,
            }),
        }),

        //============= ADMIN =====================================
        // Get all contacts
        getAdminContacts: builder.query<IQueryResponse<IContactMessage[]>, Record<string, any>>({
            query: (params) => ({ url: '/contacts', params }),
            providesTags: ['AdminContacts'],
        }),

        // Get single contact
        getAdminContact: builder.query<{ success: boolean; data: IContactMessage }, string>({
            query: (id) => `/contacts/${id}`,
            providesTags: (_r, _e, id) => [{ type: 'AdminContacts', id }],
        }),

        // Update contact status
        updateContactStatus: builder.mutation<
            { success: boolean; message: string; data: IContactMessage },
            { id: string;  notes?: string }
        >({
            query: ({ id, ...body }) => ({
                url: `/contacts/${id}/status`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['AdminContacts'],
        }),

        // Update contact category
        updateContactCategory: builder.mutation<
            { success: boolean; message: string; data: IContactMessage },
            { id: string; category: string | null; }
        >({
            query: ({ id, ...body }) => ({
                url: `/contacts/${id}/category`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['AdminContacts'],
        }),

        // Delete contact
        deleteContact: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/contacts/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AdminContacts'],
        }),
    }),
});

export const {
    useSubmitContactMutation,
    useDeleteContactMutation,
    useGetAdminContactQuery,
    useGetAdminContactsQuery,
    useUpdateContactStatusMutation,
    useUpdateContactCategoryMutation

} = contactApi;