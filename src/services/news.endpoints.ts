// news.endpoint.ts
import type { IQueryResponse } from "@/types";
import { api } from "./api";
import type { INewsProps, IPostNews } from "@/types/news.interface";

const newsApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // GET all news (with pagination, filtering)
        getNews: builder.query<IQueryResponse<INewsProps[]>, {
            page?: number;
            limit?: number;
            category?: string;
            search?: string;
            sortBy?: string;
            status?: 'published' | 'draft' | 'archived';
        }>({
            query: (params) => ({
                url: "/news",
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 10,
                    category: params?.category,
                    search: params?.search,
                    sortBy: params?.sortBy || '-createdAt',
                    status: params?.status,
                },
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ _id }) => ({ type: 'News' as const, id: _id })),
                        { type: 'News', id: 'LIST' },
                    ]
                    : [{ type: 'News', id: 'LIST' }],
        }),

        // GET trending news (most viewed/liked)
        getTrendingNews: builder.query<IQueryResponse<INewsProps[]>, { limit?: number }>({
            query: (params) => ({
                url: "/news/trending",
                params: { limit: params?.limit || 5 },
            }),
            providesTags: [{ type: 'News', id: 'TRENDING' }],
        }),

        // GET latest news
        getLatestNews: builder.query<IQueryResponse<INewsProps[]>, { limit?: number }>({
            query: (params) => ({
                url: "/news/latest",
                params: { limit: params?.limit || 5 },
            }),
            providesTags: [{ type: 'News', id: 'LATEST' }],
        }),

        // GET news by category
        getNewsByCategory: builder.query<IQueryResponse<INewsProps[]>, {
            category: string;
            page?: number;
            limit?: number;
        }>({
            query: ({ category, page, limit }) => ({
                url: `/news/category/${category}`,
                params: { page, limit },
            }),
            providesTags: (_result, _error, { category }) => [
                { type: 'News', id: `CATEGORY_${category}` },
            ],
        }),

        // GET news by slug
        getNewsItem: builder.query<IQueryResponse<INewsProps>, string>({
            query: (slug) => `/news/${slug}`,
            providesTags: (_result, _error, slug) => [{ type: 'News', id: slug }],
        }),

        // GET news stats (views, likes, shares)
        getNewsStats: builder.query<IQueryResponse<{
            totalViews: number;
            totalLikes: number;
            totalShares: number;
            averageReadTime: number;
            topCategories: Array<{ category: string; count: number }>;
        }>, { startDate?: string; endDate?: string }>({
            query: (params) => ({
                url: "/news/stats",
                params,
            }),
            providesTags: [{ type: 'News', id: 'STATS' }],
        }),

        // CREATE news article
        createNews: builder.mutation<IQueryResponse<INewsProps>,Partial<IPostNews> >({
            query: (body) => ({
                url: "/news",
                method: "POST",
                body,
            }),
            invalidatesTags: [
                { type: 'News', id: 'LIST' },
                { type: 'News', id: 'LATEST' },
                { type: 'News', id: 'TRENDING' },
                { type: 'News', id: 'STATS' },
            ],
        }),

        // UPDATE news article (full update - PUT)
        updateNews: builder.mutation<IQueryResponse<INewsProps>, Partial<INewsProps>>({
            query: ({ _id: id, ...body }) => ({
                url: `/news/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (_result, _error, { _id:id }) => [
                { type: 'News', id: 'LIST' },
                { type: 'News', id },
                { type: 'News', id: 'LATEST' },
                { type: 'News', id: 'TRENDING' },
            ],
        }),

        // PATCH news article (partial update)
        patchNews: builder.mutation<IQueryResponse<INewsProps>, { id: string; body: Partial<INewsProps> }>({
            query: ({ id, body }) => ({
                url: `/news/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'News', id: 'LIST' },
                { type: 'News', id },
                { type: 'News', id: 'LATEST' },
                { type: 'News', id: 'TRENDING' },
            ],
        }),

        // TOGGLE publish status (publish/unpublish)
        togglePublishStatus: builder.mutation<IQueryResponse<INewsProps>, {
            id: string;
            publish: boolean;
            scheduledDate?: string;
        }>({
            query: ({ id, publish, scheduledDate }) => ({
                url: `/news/${id}/publish`,
                method: "PATCH",
                body: { publish, scheduledDate },
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'News', id: 'LIST' },
                { type: 'News', id },
                { type: 'News', id: 'LATEST' },
                { type: 'News', id: 'TRENDING' },
            ],
        }),

        // LIKE news article
        likeNews: builder.mutation<IQueryResponse<{ likes: number }>, string>({
            query: (newsId) => ({
                url: `/news/${newsId}/like`,
                method: "POST",
            }),
            invalidatesTags: (_result, _error, newsId) => [
                { type: 'News', id: newsId },
                { type: 'News', id: 'TRENDING' },
                { type: 'News', id: 'STATS' },
            ],
        }),

        // UNLIKE news article
        unlikeNews: builder.mutation<IQueryResponse<{ likes: number }>, string>({
            query: (newsId) => ({
                url: `/news/${newsId}/unlike`,
                method: "POST",
            }),
            invalidatesTags: (_result, _error, newsId) => [
                { type: 'News', id: newsId },
                { type: 'News', id: 'TRENDING' },
                { type: 'News', id: 'STATS' },
            ],
        }),

        // SHARE news article
        shareNews: builder.mutation<IQueryResponse<{ shares: number }>, {
            newsId: string;
            platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'email';
        }>({
            query: ({ newsId, platform }) => ({
                url: `/news/${newsId}/share`,
                method: "POST",
                body: { platform },
            }),
            invalidatesTags: (_result, _error, { newsId }) => [
                { type: 'News', id: newsId },
                { type: 'News', id: 'TRENDING' },
                { type: 'News', id: 'STATS' },
            ],
        }),

        // DELETE news article
        deleteNews: builder.mutation<IQueryResponse<INewsProps>, string>({
            query: (newsId) => ({
                url: `/news/${newsId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, newsId) => [
                { type: 'News', id: 'LIST' },
                { type: 'News', id: 'LATEST' },
                { type: 'News', id: 'TRENDING' },
                { type: 'News', id: newsId },
                { type: 'News', id: 'STATS' },
            ],
        }),

        // BULK DELETE news articles
        bulkDeleteNews: builder.mutation<IQueryResponse<{ deletedCount: number }>, string[]>({
            query: (newsIds) => ({
                url: "/news/bulk/delete",
                method: "POST",
                body: { newsIds },
            }),
            invalidatesTags: [
                { type: 'News', id: 'LIST' },
                { type: 'News', id: 'LATEST' },
                { type: 'News', id: 'TRENDING' },
                { type: 'News', id: 'STATS' },
            ],
        }),

        // GET related news
        getRelatedNews: builder.query<IQueryResponse<INewsProps[]>, {
            newsId: string;
            limit?: number;
        }>({
            query: ({ newsId, limit }) => ({
                url: `/news/${newsId}/related`,
                params: { limit: limit || 3 },
            }),
            providesTags: (_result, _error, { newsId }) => [
                { type: 'News', id: `RELATED_${newsId}` },
            ],
        }),

        // GET news by author
        getNewsByAuthor: builder.query<IQueryResponse<INewsProps[]>, {
            authorId: string;
            page?: number;
            limit?: number;
        }>({
            query: ({ authorId, page, limit }) => ({
                url: `/news/author/${authorId}`,
                params: { page, limit },
            }),
            providesTags: (_result, _error, { authorId }) => [
                { type: 'News', id: `AUTHOR_${authorId}` },
            ],
        }),

        // INCREMENT view count
        incrementViewCount: builder.mutation<IQueryResponse<{ views: number }>, string>({
            query: (newsId) => ({
                url: `/news/${newsId}/view`,
                method: "POST",
            }),
            invalidatesTags: (_result, _error, newsId) => [
                { type: 'News', id: newsId },
                { type: 'News', id: 'TRENDING' },
                { type: 'News', id: 'STATS' },
            ],
        }),
    }),
});

export const {
    // Queries
    useGetNewsQuery,
    useGetNewsItemQuery,
    useGetTrendingNewsQuery,
    useGetLatestNewsQuery,
    useGetNewsByCategoryQuery,
    useGetNewsStatsQuery,
    useGetRelatedNewsQuery,
    useGetNewsByAuthorQuery,

    // Mutations
    useCreateNewsMutation,
    useUpdateNewsMutation,
    usePatchNewsMutation,
    useTogglePublishStatusMutation,
    useLikeNewsMutation,
    useUnlikeNewsMutation,
    useShareNewsMutation,
    useDeleteNewsMutation,
    useBulkDeleteNewsMutation,
    useIncrementViewCountMutation,

    // Lazy queries
    useLazyGetNewsQuery,
    useLazyGetTrendingNewsQuery,
    useLazyGetLatestNewsQuery,
    useLazyGetNewsByCategoryQuery,
    useLazyGetNewsItemQuery,
} = newsApi;

// Export the API for use in store
export default newsApi;