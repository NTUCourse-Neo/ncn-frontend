import { useEffect } from "react";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";
import { useInView } from "react-intersection-observer";

export default function usePagination() {
  const { ref, inView: reachedBottom } = useInView({
    /* Optional options */
    threshold: 0,
  });
  const { searchResultCount, totalCount, fetchNextPage } =
    useCourseSearchingContext();

  useEffect(() => {
    // console.log('reachedBottom: ',reachedBottom);
    if (reachedBottom && searchResultCount !== 0) {
      // fetch next batch of search results
      if (searchResultCount < totalCount) {
        fetchNextPage();
      }
    }
  }, [reachedBottom]); // eslint-disable-line react-hooks/exhaustive-deps

  return ref;
}
