// docs.endpoints.ts
import type { IQueryResponse } from "@/types";
import { api } from "./api";
import type { IDocFile, IFolder, IFolderMetrics } from "@/types/doc";
import { formatError } from "@/lib/error";

const docsApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // Document endpoints
        getDocuments: builder.query<IQueryResponse<IDocFile[]>, string | void>({
            query: (queryString = "") => `/docs${queryString}`,
            providesTags: ["Documents"],
            transformErrorResponse: (response) => formatError(response),
        }),

        getDocumentById: builder.query<IQueryResponse<IDocFile>, string>({
            query: (documentId) => `/docs/${documentId}`,
            providesTags: ["Documents"],
            transformErrorResponse: (response) => formatError(response),
        }),

        createDocument: builder.mutation<IQueryResponse<IDocFile>, Partial<IDocFile>>({
            query: (body) => ({
                url: "/docs",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Documents", "Folders",],
            transformErrorResponse: (response) => formatError(response),
        }),

        updateDocument: builder.mutation<IQueryResponse<IDocFile>, Partial<IDocFile>>({
            query: (body) => ({
                url: `/docs/${body._id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Documents"],
            transformErrorResponse: (response) => formatError(response),
        }),

        deleteDocuments: builder.mutation<IQueryResponse<null>, string[]>({
            query: (documentIds) => ({
                url: "/docs/batch",
                method: "DELETE",
                body: { documentIds },
            }),
            invalidatesTags: ["Documents", "Folders",],
            transformErrorResponse: (response) => formatError(response),
        }),

        deleteDocument: builder.mutation<IQueryResponse<null>, string>({
            query: (documentId) => ({
                url: `/docs/${documentId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Documents", "Folders",],
            transformErrorResponse: (response) => formatError(response),
        }),

        moveCopyDocuments: builder.mutation<
            IQueryResponse<null>,
            { files: IDocFile[]; actionType: 'Move' | 'Copy'; destinationFolder: string }
        >({
            query: (body) => ({
                url: "/docs/move-copy",
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Documents", "Folders"],
            transformErrorResponse: (response) => formatError(response),
        }),

        // Folder endpoints
        getFolders: builder.query<IQueryResponse<IFolder[]>, string | void>({
            query: (queryString = "") => `/docs/folders${queryString}`,
            providesTags: ["Folders"],
            transformErrorResponse: (response) => formatError(response),
        }),

        getFolderByName: builder.query<IQueryResponse<IFolder>, string>({
            query: (folderName) => `/docs/folders/name/${encodeURIComponent(folderName)}`,
            providesTags: ["Folders"],
            transformErrorResponse: (response) => formatError(response),
        }),

        getFolderDocuments: builder.query<
            IQueryResponse<IDocFile[]>,
            { folderId: string; queryString?: string }
        >({
            query: ({ folderId, queryString = "" }) =>
                `/docs/folders/${folderId}/documents${queryString}`,
            providesTags: ["Documents"],
            transformErrorResponse: (response) => formatError(response),
        }),

        createFolder: builder.mutation<IQueryResponse<IFolder>, Partial<IFolder>>({
            query: (body) => ({
                url: "/docs/folders",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Folders",],
            transformErrorResponse: (response) => formatError(response),
        }),

        updateFolder: builder.mutation<IQueryResponse<IFolder>, Partial<IFolder>>({
            query: (body) => ({
                url: `/docs/folders/${body._id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Folders", "Documents"],
            transformErrorResponse: (response) => formatError(response),
        }),

        deleteFolder: builder.mutation<IQueryResponse<null>, string>({
            query: (folderId) => ({
                url: `/docs/folders/${folderId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Folders", "Documents",],
            transformErrorResponse: (response) => formatError(response),
        }),

        // Folder metrics
        getFolderMetrics: builder.query<IQueryResponse<IFolderMetrics[]>, void>({
            query: () => "/docs/metrics",
            providesTags: ["Folders", "Documents"],
            transformErrorResponse: (response) => formatError(response),
        }),

        // Alternative: get documents by folder name (if needed)
        getDocumentsByFolderName: builder.query<
            IQueryResponse<IDocFile[]>,
            { folderName: string; queryString?: string }
        >({
            query: ({ folderName, queryString = "" }) =>
                `/docs/folders/name/${encodeURIComponent(folderName)}/documents${queryString}`,
            providesTags: ["Documents"],
            transformErrorResponse: (response) => formatError(response),
        }),
    }),
});

export const {
    // Document hooks
    useGetDocumentsQuery,
    useGetDocumentByIdQuery,
    useCreateDocumentMutation,
    useUpdateDocumentMutation,
    useDeleteDocumentsMutation,
    useDeleteDocumentMutation,
    useMoveCopyDocumentsMutation,

    // Folder hooks
    useGetFoldersQuery,
    useGetFolderByNameQuery,
    useGetFolderDocumentsQuery,
    useCreateFolderMutation,
    useUpdateFolderMutation,
    useDeleteFolderMutation,

    // Metrics hooks
    useGetFolderMetricsQuery,

    // Alternative
    useGetDocumentsByFolderNameQuery,
} = docsApi;