// dashboard.endpoint.ts
import type { IQueryResponse } from "@/types";
import { api } from "./api";
import type {
    IDashboardMetrics,
    ISeasonMetrics,
    IHeadToHeadMetrics,
    IPlayerMetrics,
    IOverviewMetrics,
    ITrendMetrics
} from "@/types/metrics.interface";


const dashboardApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // GET dashboard metrics
        getDashboardMetrics: builder.query<IQueryResponse<IDashboardMetrics>, {
            season?: string;
            tournament?: string;
        }>({
            query: (params) => ({
                url: "/dashboard/metrics",
                params,
            }),
            providesTags: ["Metrics"],
        }),

        // GET season metrics
        getSeasonMetrics: builder.query<IQueryResponse<ISeasonMetrics>, {
            seasonId: string;
        }>({
            query: ({ seasonId }) => `/dashboard/season/${seasonId}`,
            providesTags: ["Metrics"],
        }),

        // GET head to head metrics
        getHeadToHeadMetrics: builder.query<IQueryResponse<IHeadToHeadMetrics>, {
            team1Id: string;
            team2Id: string;
            season?: string;
        }>({
            query: (params) => ({
                url: "/dashboard/head-to-head",
                params,
            }),
            providesTags: ["Metrics"],
        }),

        // GET player metrics
        getPlayerMetrics: builder.query<IQueryResponse<IPlayerMetrics>, {
            playerId: string;
            season?: string;
        }>({
            query: (params) => ({
                url: `/dashboard/player/${params.playerId}`,
                params: { season: params.season },
            }),
            providesTags: ["Metrics"],
        }),

        // GET overview metrics
        getOverviewMetrics: builder.query<IQueryResponse<IOverviewMetrics>, {
            timeframe: 'day' | 'week' | 'month' | 'season' | 'year';
            date?: string;
        }>({
            query: (params) => ({
                url: "/dashboard/overview",
                params,
            }),
            providesTags: ["Metrics"],
        }),

        // GET metric trends
        getMetricTrends: builder.query<IQueryResponse<ITrendMetrics>, {
            metric: string;
            period: 'daily' | 'weekly' | 'monthly';
            fromDate: string;
            toDate: string;
        }>({
            query: (params) => ({
                url: "/dashboard/trends",
                params,
            }),
            providesTags: ["Metrics"],
        }),

    }),
});

export const {
    useGetDashboardMetricsQuery,
    useGetSeasonMetricsQuery,
    useGetHeadToHeadMetricsQuery,
    useGetPlayerMetricsQuery,
    useGetOverviewMetricsQuery,
    useGetMetricTrendsQuery,

    // Lazy queries
    useLazyGetDashboardMetricsQuery,
    useLazyGetSeasonMetricsQuery,
    useLazyGetHeadToHeadMetricsQuery,
    useLazyGetPlayerMetricsQuery,
    useLazyGetOverviewMetricsQuery,
    useLazyGetMetricTrendsQuery,
} = dashboardApi;

export default dashboardApi;