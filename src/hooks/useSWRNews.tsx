import useSWR from "swr";
import axios from "axios";
import apiClient from "./apiClient";

interface NewsItem {
  _id: string;
  title: string;
  intro?: string;
  content: string;
  files?: string[] | undefined;
  nickname?: string;
  email?: string;
  tags?: string;
  date?: string;
  confirmed?: boolean;
  confirmationToken?: string;
  commentsSection?: {
    comments: Array<{
      author: string;
      text: string;
      date: string;
    }>;
  };
}

interface PaginatedNewsResponse {
  news: NewsItem[];
  totalPages: number;
}

const fetcher = (url: string) =>
  apiClient.get<PaginatedNewsResponse>(url).then((res) => res.data);

export const usePaginatedNews = (
  pageSize: number,
  selectedPage: number
): {
  data: NewsItem[];
  loading: boolean;
  error: any;
  forceRevalidateAll: () => void;
  totalPages: number;
} => {
  const { data, error, isValidating, mutate } = useSWR(
    `/news/all?page=${selectedPage}&limit=${pageSize}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  );

  return {
    data: data?.news || [],
    loading: isValidating,
    error,
    forceRevalidateAll: mutate,
    totalPages: data?.totalPages || 0,
  };
};
