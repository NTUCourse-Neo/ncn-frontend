import useSWR from "swr";
import { fetchSearchResult } from "queries/course";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";
import { useToast } from "@chakra-ui/react";

export default function useSearchResult(
  searchKeyword: string | null,
  pageIndex: number
) {
  const toast = useToast();
  const {
    searchColumns,
    searchSettings,
    searchFiltersEnable,
    searchFilters,
    batchSize,
    searchSemester,
    searchResultCount,
    setTotalCount,
    setSearchLoading,
    setSearchResultCount,
  } = useCourseSearchingContext();
  const { data, error, isValidating } = useSWR(
    `/api/search/${searchKeyword}/${pageIndex}`,
    async () => {
      if (!searchSemester) {
        toast({
          title: "獲取課程資訊失敗",
          description: "請選擇學期",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        throw new Error("Missing semester env variable");
      }
      setSearchLoading(true);
      const coursesData = await fetchSearchResult(
        searchKeyword ?? "",
        searchColumns,
        searchFiltersEnable,
        searchFilters,
        batchSize,
        pageIndex * batchSize,
        searchSemester,
        searchSettings.strict_search_mode
      );
      setSearchLoading(false);
      return coursesData;
    },
    {
      onSuccess: (d, k, c) => {
        setTotalCount(d.total_count);
        setSearchResultCount(searchResultCount + d?.courses?.length ?? 0);
      },
      onError: (e, k, c) => {
        console.log(e);
        toast({
          title: "獲取課程資訊失敗",
          description: "請檢查網路連線",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
      revalidateOnFocus: false,
    }
  );

  return {
    courses: data?.courses ?? [],
    isLoading: (!data && !error) || isValidating,
    error,
  };
}
