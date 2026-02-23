import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export function getErrorMessage(
    error: unknown,
    customMessage?: string
): string {
    if (!error) return "Unknown error occurred";

    // ✅ handle string FIRST
    if (typeof error === "string") return error;

    // ✅ Fetch Response
    if (error instanceof Response) {
        return `Request failed: ${error.status} ${error.statusText}`;
    }

    // ✅ ensure it's an object before accessing properties
    if (typeof error !== "object") {
        return customMessage ?? "Something went wrong. Please try again.";
    }

    const err = error as Record<string, unknown>;

    // 1. Structured API errors
    if (typeof err.error === "string") return err.error;
    if (typeof err.message === "string") return err.message;

    // 2. Axios errors
    if (err.response && typeof err.response === "object") {
        const response = err.response as Record<string, unknown>;

        if (response.data && typeof response.data === "object") {
            const data = response.data as Record<string, unknown>;

            if (typeof data.message === "string") return data.message;
            if (typeof data.error === "string") return data.error;
        }
    }

    // 3. Validation errors
    if (Array.isArray(err.details)) {
        return err.details
            .map((d: any) => d?.message)
            .filter(Boolean)
            .join(", ");
    }

    // Mongoose validation
    if (
        err.name === "ValidationError" &&
        err.errors &&
        typeof err.errors === "object"
    ) {
        return Object.values(err.errors as any)
            .map((e: any) => e?.message)
            .filter(Boolean)
            .join(", ");
    }

    // 4. Network errors
    if (err.name === "NetworkError") {
        return "Network error — please check your connection.";
    }

    return customMessage ?? "Something went wrong. Please try again.";
}



interface ErrorPayload {
    message?: string;
    error?: string;
}

/**RTK Query error formatting**/
export const formatError = (
    error: FetchBaseQueryError | SerializedError | undefined
): string => {
    if (!error) {
        return "An unknown error occurred.";
    }

    // RTK Query HTTP errors
    if ("status" in error) {
        // Network error
        if (error.status === "FETCH_ERROR") {
            return "Network error. Check your internet connection.";
        }

        // Timeout / parsing issues
        if (error.status === "PARSING_ERROR") {
            return "Server response error.";
        }

        // HTTP status handling
        if (typeof error.status === "number") {
            if (error.status >= 500) {
                return "Something went wrong. Try again later.";
            }

            if (error.status === 401) {
                return "Session expired. Please login again.";
            }

            if (error.status === 403) {
                return "You are not allowed to perform this action.";
            }

            if (error.status === 404) {
                return "Requested resource not found.";
            }
        }

        // API response message
        if ("data" in error && error.data) {
            const data = error.data as ErrorPayload;

            return (
                data.message ||
                data.error ||
                "Request failed."
            );
        }
    }

    // JS/runtime errors
    if ("message" in error && error.message) {
        return error.message;
    }

    return "An unknown error occurred.";
};