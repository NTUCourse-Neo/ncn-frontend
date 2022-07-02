import { useEffect } from "react";
import useOnScreen from "hooks/useOnScreen";
import { useToast } from "@chakra-ui/react";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";

export default function usePagination(ref) {
  const reachedBottom = useOnScreen(ref);
  const {
    searchResult,
    totalCount,
    searchSettings,
    searchFiltersEnable,
    searchFilters,
    offset,
    batchSize,
    searchIds,
    fetchSearchResults,
    setSearchLoading,
    setSearchError,
    setOffset,
    setSearchResult,
  } = useCourseSearchingContext();
  const toast = useToast();

  useEffect(() => {
    // console.log('reachedBottom: ',reachedBottom);
    if (reachedBottom && searchResult.length !== 0) {
      // fetch next batch of search results
      if (searchResult.length < totalCount) {
        try {
          setSearchLoading(true);
          fetchSearchResults(searchIds, searchFiltersEnable, searchFilters, batchSize, offset, searchSettings.strict_search_mode, {
            onSuccess: ({ courses, ...rest }) => {
              setSearchResult([...searchResult, ...courses]);
              setSearchError(null);
              setOffset(offset + batchSize);
              setSearchLoading(false);
            },
          });
        } catch (error) {
          setSearchError(error);
          setSearchLoading(false);
          toast({
            title: "獲取課程資訊失敗",
            description: "請檢查網路連線",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    }
  }, [reachedBottom]); // eslint-disable-line react-hooks/exhaustive-deps
}
