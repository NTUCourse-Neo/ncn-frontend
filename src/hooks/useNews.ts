import useSWR from "swr";
import { useState } from "react";
import handleFetch from "@/utils/CustomFetch";

export default function useNews(pageIndex: number) {
  const NEWS_PER_PAGE = 11;
  const [numOfNewsPage, setNumOfNewsPage] = useState(0);
  const { data, error, isValidating, mutate } = useSWR(
    `/api/news/${pageIndex}`,
    async () => {
      // TODO: fetch news
      // const newsData = await handleFetch<unknown>("api/news", {
      //   pageIndex: pageIndex,
      // });
      // return newsData;
    },
    {
      onSuccess: (d, k, c) => {
        // TODO: update total number of pages
        // const totalNewsCount = d?.totalNewsCount ?? 0;
        // setNumOfNewsPage(Math.ceil( totalNewsCount / NEWS_PER_PAGE));
      },
      onError: (e, k, c) => {
        // TODO: toast error
        console.log("123");
      },
      revalidateOnFocus: false,
    }
  );

  return {
    news: data ?? [],
    isLoading: (!data && !error) || isValidating,
    error,
    mutate,
    numOfNewsPage,
  };
}
