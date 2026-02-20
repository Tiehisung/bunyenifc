import type { IQueryResponse } from "@/types";
import type { IUser } from "@/types/user";
import { api } from "./api";

const authApi = api.injectEndpoints({
    endpoints: (builder) => ({

        getUsers: builder.query<IQueryResponse<IUser[]>, void>({
            query: () => "/users",
            providesTags: ["Users"],
        }),

        createUser: builder.mutation<IQueryResponse<IUser>, Partial<IUser>>({
            query: (body) => ({
                url: "/users",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Users"],
        }),

        deleteUser: builder.mutation<IQueryResponse<IUser>, string>({
            query: (userId) => ({
                url: `/users/${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Users"],
        }),

    }),
});

export const {
    useGetUsersQuery,
    useCreateUserMutation,
    useDeleteUserMutation
} = authApi;
