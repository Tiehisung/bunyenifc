"use client";

 
import { apiConfig } from "@/lib/configs";
import { buildQueryString } from "@/lib/searchParams";
import { IQueryResponse } from "@/types";
import { useEffect, useState } from "react";
import { useRefetchOnRefresh } from "./refetch-on-refresh";
import { getErrorMessage } from "@/lib/error";

interface IFetchProps {
  uri: string;
  filters?: Record<string, string>;
  skip?: boolean;
  refetchOnRefresh?: boolean;
}

export function useFetch<T = unknown>({
  uri,
  filters = { limit: "100000" },
  skip = false,
  refetchOnRefresh,
}: IFetchProps) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<IQueryResponse<T> | null>(null);

  const [refetchIndex, setRefetchIndex] = useState(0);
  // const refetch = () => {
  //   setTimeout(() => {
  //     setRefetchIndex((p) => p + 1);
  //   }, 300);
  // };

  const refetch = () => {
    if (refetchOnRefresh) setRefetchIndex((p) => p + 1);
  };

  // Hook to auto-refetch when router.refresh() is called
  useRefetchOnRefresh(refetch);

  const query = buildQueryString({ limit: "50000", ...filters });

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (skip) return;
        setLoading(true);
        const resolvedUri = uri.startsWith(apiConfig.base)
          ? uri
          : apiConfig.base + (uri.startsWith("/") ? uri : `/${uri}`);
        const response = await fetch(`${resolvedUri}${query}`);
        if (!response.ok) {
          setResults({
            message: getErrorMessage(response.statusText),
            success: false,
            data: undefined,
          });
        } else {
          const results = await response.json();
          setResults(results);
        }
      } catch (error) {
        setResults({
          message: getErrorMessage(error),
          success: false,
          data: undefined,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refetchIndex]);
  return { loading, results, refetch };
}
