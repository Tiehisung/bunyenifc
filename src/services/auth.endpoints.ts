import type { IQueryResponse } from "@/types";
import type { EUserRole, IUser } from "@/types/user";
import { api } from "./api";
import type { ILogin, ISignup } from "@/types/auth";
import { clearUser, setUser } from "@/features/user.slice";
import { formatError } from "@/lib/error";



const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Sign in an existing user
    signIn: builder.mutation<IQueryResponse<IUser>, Partial<ILogin>>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),

      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        // dispatch the setUser action with the user data if login is successful
        if (data.success && data.data) {
          dispatch(setUser(data.data));
        }
      },

      transformErrorResponse: (response) => formatError(response),
    }),

    // Sign up a new user
    signUp: builder.mutation<IQueryResponse<IUser>, Partial<ISignup>>({
      query: (newUser) => ({
        url: '/auth/signup',
        method: 'POST',
        body: newUser,
      }),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        // dispatch the setUser action with the user data if login is successful
        if (data.success && data.data) {
          dispatch(setUser(data.data));
        }
      },
      invalidatesTags: ['Users','Auth'],
    }),

    // Verify email
    verifyOtp: builder.mutation<IQueryResponse, string>({
      query: (otp) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: { otp },
      }),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        //flag email verified
        if (data.success) {
          dispatch(setUser({ emailVerified: true }));
        }
      },
    }),

    // Resend OTP
    resendOtp: builder.mutation<IQueryResponse, void>({
      query: () => ({
        url: '/auth/resend-otp',
        method: 'POST',
      }),
    }),

    //google auth
    googleAuth: builder.query<IQueryResponse, { role?: string }>({
      query: (body) => ({
        url: '/auth/google',
        method: 'GET',
        query: body,
      }),
    }),

    //update user role
    updateUserRole: builder.mutation<
      IQueryResponse<IUser>,
      { role: Exclude<EUserRole, 'super_admin' | 'admin'> }
    >({
      query: (body) => ({
        url: '/auth/update-role',
        method: 'PATCH',
        body,
      }),

      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        // dispatch the setUser action with the user data if login is successful
        if (data.success && data.data) {
          dispatch(setUser(data.data));
        }
      },

      transformErrorResponse: (response) => formatError(response),
    }),



    // forgot password
    forgotPassword: builder.mutation<IQueryResponse, { email: string }>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
      transformErrorResponse: (response) => formatError(response),
    }),

    // reset password
    resetPassword: builder.mutation<
      IQueryResponse,
      { newPassword: string; confirmPassword: string; token: string }
    >({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
      transformErrorResponse: (response) => formatError(response),
    }),

    //get user basic details
    getAuthUserBasicDetails: builder.query<IQueryResponse<IUser>, void>({
      query: () => ({
        url: '/auth/profile',
        method: 'GET',
      }),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        // dispatch the setUser action with the user data if login is successful
        if (data.success && data.data) {
          dispatch(setUser(data.data));
        }
      },

      transformErrorResponse: (response) => formatError(response),
    }),

    // Sign out an existing user
    signOut: builder.mutation<IQueryResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        // console.log({ data });
        // dispatch the setUser action with the user data if login is successful
        if (data.success) {
          dispatch(clearUser());
        }
      },
    }),

    // Update user details
    // updateUserDetails: builder.mutation<
    //   IQueryResponse<IUpdateUserDetails>,
    //   IUpdateUserDetails
    // >({
    //   query: (userDetails) => ({
    //     url: '/auth/profile',
    //     method: 'PATCH',
    //     body: userDetails,
    //   }),
    // }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLazyGoogleAuthQuery,
  useUpdateUserRoleMutation,
  useGetAuthUserBasicDetailsQuery,
  useLazyGetAuthUserBasicDetailsQuery,
  useSignOutMutation,
} = authApi;
