import type { IQueryResponse } from "@/types";
import { api } from "./api";
import type { IPlayer } from "@/types/player.interface";

const playerApi = api.injectEndpoints({
    endpoints: (builder) => ({

        getPlayers: builder.query<IQueryResponse<IPlayer[]>, void>({
            query: () => "/players",
            providesTags: ["Players"],
        }),
        getPlayerBySlugOrId: builder.query<IQueryResponse<IPlayer[]>, string>({
            query: (slugOrId) => `/players/${slugOrId}`,
            providesTags: ["Players"],
        }),

        createPlayer: builder.mutation<IQueryResponse<IPlayer>, Partial<IPlayer>>({
            query: (body) => ({
                url: "players",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Players"],
        }),
        updatePlayer: builder.mutation<IQueryResponse<IPlayer>, Partial<IPlayer>>({
            query: (body) => ({
                url: `players/${body._id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Players"],
        }),
        patchPlayer: builder.mutation<IQueryResponse<IPlayer>, Partial<IPlayer>>({
            query: (body) => ({
                url: `players/${body._id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Players"],
        }),

        deletePlayer: builder.mutation<IQueryResponse<IPlayer>, string>({
            query: (playerId) => ({
                url: `/players/${playerId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Players"],
        }),

    }),
});

export const {
    useGetPlayersQuery,
    useGetPlayerBySlugOrIdQuery,
    useCreatePlayerMutation,
    useUpdatePlayerMutation,
    usePatchPlayerMutation,
    useDeletePlayerMutation
} = playerApi;