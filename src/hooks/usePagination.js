import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useOnScreen from "hooks/useOnScreen";
import { useToast } from "@chakra-ui/react";
import { fetchSearchResults } from "actions/courses";

export default function usePagination(ref) {
  const reachedBottom = useOnScreen(ref);
  const dispatch = useDispatch();
  const toast = useToast();

  const search_results = useSelector((state) => state.search_results);
  const total_count = useSelector((state) => state.total_count);
  const search_settings = useSelector((state) => state.search_settings);
  const search_filters_enable = useSelector((state) => state.search_filters_enable);
  const search_filters = useSelector((state) => state.search_filters);
  const offset = useSelector((state) => state.offset);
  const batch_size = useSelector((state) => state.batch_size);
  const search_ids = useSelector((state) => state.search_ids);

  useEffect(() => {
    // console.log('reachedBottom: ',reachedBottom);
    if (reachedBottom && search_results.length !== 0) {
      // fetch next batch of search results
      if (search_results.length < total_count) {
        try {
          dispatch(fetchSearchResults(search_ids, search_filters_enable, search_filters, batch_size, offset, search_settings.strict_search_mode));
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
