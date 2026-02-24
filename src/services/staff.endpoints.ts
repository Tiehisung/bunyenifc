// manager.endpoint.ts
import type { IQueryResponse, IRecord } from "@/types";
import { api } from "./api";
import { IStaff } from "@/types/staff.interface";



const staffMemberApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // GET all managers
        getStaffMembers: builder.query<IQueryResponse<IStaff[]>, {
            page?: number;
            limit?: number;
            search?: string;
            sortBy?: string;
        } & IRecord>({
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
        getActiveStaffMembers: builder.query<IQueryResponse<IStaff[]>, {
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
        getStaffMemberByRole: builder.query<IQueryResponse<IStaff[]>, {
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
        getStaffMember: builder.query<IQueryResponse<IStaff>, string>({

            // GET manager by ID
            query: (id) => `/managers/${id}`,
            providesTags: ["Managers"],
        }),

        // GET manager statistics
        getStaffMemberStats: builder.query<IQueryResponse<any>, void>({
            query: () => "/managers/stats",
            providesTags: ["Managers"],
        }),

        // CREATE manager
        createStaff: builder.mutation<IQueryResponse<IStaff>, Partial<IStaff>>({
            query: (body) => ({
                url: "/managers",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Managers"],
        }),

        // UPDATE manager
        updateStaff: builder.mutation<IQueryResponse<IStaff>, Partial<IStaff>>({
            query: ({ _id, ...body }) => ({
                url: `/managers/${_id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Managers"],
        }),

        // DEACTIVATE manager
        deactivateStaff: builder.mutation<IQueryResponse<IStaff>, {
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
        activateStaff: builder.mutation<IQueryResponse<IStaff>, {
            id: string;
        }>({
            query: ({ id }) => ({
                url: `/managers/${id}/activate`,
                method: "PATCH",
            }),
            invalidatesTags: ["Managers"],
        }),

        // DELETE manager
        deleteStaff: builder.mutation<IQueryResponse<IStaff>, string>({
            query: (id) => ({
                url: `/managers/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Managers"],
        }),

    }),
});

export const {
    useGetStaffMembersQuery,
    useGetStaffMemberQuery,
    useGetActiveStaffMembersQuery,
    useGetStaffMemberByRoleQuery,
    useGetStaffMemberStatsQuery,
    useCreateStaffMutation,
    useUpdateStaffMutation,
    useDeactivateStaffMutation,
    useActivateStaffMutation,
    useDeleteStaffMutation,
} = staffMemberApi;

export default staffMemberApi;