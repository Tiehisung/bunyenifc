// services/api.ts

import { RootState } from "@/store/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.accessToken;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: [
        'Auth',
        'Captains',
        'Cards',
        'Documents',
        'Donations',
        'Features',
        'Files',
        'Folders',
        'Gallery',
        'Goals',
        'Highlights',
        'Injuries',
        'Logs',
        'Matches',
        'Me',
        'MVPs',
        'News',
        'Players',
        'Staff',
        'Teams',
        'Training',
        'Transactions',
        'Sponsors',
        'Squads',
        "Users",
        'Uploads',

        // Dashboards
        'Metrics',

    ],
    // keepUnusedDataFor: 300, // Keep data for 5 minutes (in seconds)
    // refetchOnMountOrArgChange: 30, // Refetch if data is older than 30 seconds
    endpoints: () => ({}),

});

