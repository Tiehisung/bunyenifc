import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        credentials: "include",
    }),
    tagTypes: [
        'Auth',
        'Captains',
        'Cards',
        'Documents',
        'Donations',
        'Features',
        'Files',
        'Gallery',
        'Goals', 
        'Highlights',
        'Injuries', 
        'Logs',
        'Managers',
        'Matches',
        'MVPs',
        'News',
        'Players',
        'Teams',
        'Training',
        'Transactions',
        'Sponsors',
        'Squads',
        "Users",

        // Dashboards
        'Metrics',

    ],
    // keepUnusedDataFor: 300, // Keep data for 5 minutes (in seconds)
    // refetchOnMountOrArgChange: 30, // Refetch if data is older than 30 seconds
    endpoints: () => ({}),

});

