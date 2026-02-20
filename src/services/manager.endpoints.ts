// manager.endpoint.ts
import type { IQueryResponse } from "@/types";
import { api } from "./api";

export interface IManager {
    email: string;
    dob: string;
    _id: string;
    avatar: string;
    role: string;
    fullname: string;
    dateSigned: string;
    phone: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
}

const managerApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // GET all managers
        getManagers: builder.query<IQueryResponse<IManager[]>, {
            page?: number;
            limit?: number;
            search?: string;
            sortBy?: string;
        }>({
            query: (params) => ({
                url: "/managers",
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 20,
                    search: params?.search,
                    sortBy: params?.sortBy || 'name',
                },
            }),
            providesTags: ["Managers"],
        }),

        // GET active managers
        getActiveManagers: builder.query<IQueryResponse<IManager[]>, {
            page?: number;
            limit?: number;
        }>({
            query: (params) => ({
                url: "/managers/active",
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 20,
                },
            }),
            providesTags: ["Managers"],
        }),

        // GET managers by role
        getManagersByRole: builder.query<IQueryResponse<IManager[]>, {
            role: string;
            page?: number;
            limit?: number;
        }>({
            query: ({ role, page, limit }) => ({
                url: `/managers/role/${role}`,
                params: { page, limit },
            }),
            providesTags: ["Managers"],
        }),

        // GET manager by ID
        getManagerById: builder.query<IQueryResponse<IManager>, string>({
            query: (id) => `/managers/${id}`,
            providesTags: ["Managers"],
        }),

        // GET manager statistics
        getManagerStats: builder.query<IQueryResponse<any>, void>({
            query: () => "/managers/stats",
            providesTags: ["Managers"],
        }),

        // CREATE manager
        createManager: builder.mutation<IQueryResponse<IManager>, Partial<IManager>>({
            query: (body) => ({
                url: "/managers",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Managers"],
        }),

        // UPDATE manager
        updateManager: builder.mutation<IQueryResponse<IManager>, { id: string; body: Partial<IManager> }>({
            query: ({ id, body }) => ({
                url: `/managers/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Managers"],
        }),

        // DEACTIVATE manager
        deactivateManager: builder.mutation<IQueryResponse<IManager>, {
            id: string;
            reason?: string;
        }>({
            query: ({ id, reason }) => ({
                url: `/managers/${id}/deactivate`,
                method: "PATCH",
                body: { reason },
            }),
            invalidatesTags: ["Managers"],
        }),

        // ACTIVATE manager
        activateManager: builder.mutation<IQueryResponse<IManager>, {
            id: string;
        }>({
            query: ({ id }) => ({
                url: `/managers/${id}/activate`,
                method: "PATCH",
            }),
            invalidatesTags: ["Managers"],
        }),

        // DELETE manager
        deleteManager: builder.mutation<IQueryResponse<IManager>, string>({
            query: (id) => ({
                url: `/managers/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Managers"],
        }),

    }),
});

export const {
    useGetManagersQuery,
    useGetActiveManagersQuery,
    useGetManagersByRoleQuery,
    useGetManagerByIdQuery,
    useGetManagerStatsQuery,
    useCreateManagerMutation,
    useUpdateManagerMutation,
    useDeactivateManagerMutation,
    useActivateManagerMutation,
    useDeleteManagerMutation,
} = managerApi;

export default managerApi;