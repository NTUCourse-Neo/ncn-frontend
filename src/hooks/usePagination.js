import { useEffect } from "react";
import useOnScreen from "hooks/useOnScreen";
import { useToast } from "@chakra-ui/react";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";

export default function usePagination(ref) {
  const reachedBottom = useOnScreen(ref);
  const { search_results, total_count, search_settings, search_filters_enable, search_filters, offset, batch_size, search_ids, fetchSearchResults } =
    useCourseSearchingContext();
  const toast = useToast();

  useEffect(() => {
    // console.log('reachedBottom: ',reachedBottom);
    if (reachedBottom && search_results.length !== 0) {
      // fetch next batch of search results
      if (search_results.length < total_count) {
        try {
          fetchSearchResults(search_ids, search_filters_enable, search_filters, batch_size, offset, search_settings.strict_search_mode);
        } catch (error) {
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
