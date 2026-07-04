import { api } from "./_api";



interface SmsBalanceResponse {
    success: boolean;
    data?: {
        balance: string;
        countryCode: string;
        isSandbox: boolean;
    };
    message?: string;
}

export interface TestSmsResponse {
    success: boolean;
    message?: string;
    recipients?: number;
    details?: any;
   
}

export const adminSmsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getSmsBalance: builder.query<SmsBalanceResponse, void>({
            query: () => '/sms/balance',
            providesTags: ['AdminSMS'],
        }),
        sendTestSms: builder.mutation<TestSmsResponse, { phone: string; message?: string }>({
            query: (body) => ({
                url: '/sms/test',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['AdminSMS'],
        }),

        getSmsLogs: builder.query<any, Record<string, any>>({
            query: (params) => ({ url: '/sms/logs', params }),
            providesTags: ['AdminSmsLogs', 'AdminSMS'],
        }),
    }),
});

export const {
    useGetSmsBalanceQuery,
    useSendTestSmsMutation,
    useGetSmsLogsQuery
} = adminSmsApi;