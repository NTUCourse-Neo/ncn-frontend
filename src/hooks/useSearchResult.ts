import useSWR from "swr";
import { fetchSearchResult } from "queries/course";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";
import { useToast } from "@chakra-ui/react";
import type { NullableSearchFilter } from "queries/course";
import { SearchMode } from "@/data/searchMode";
import { Filter, FilterType } from "@/types/search";

// generate filter for search API, only current searchMode-related filter will be used, otherwise null.
// if it is not edited, then it will also be null
function generateSearchAPIFilterObject(
  searchMode: SearchMode,
  searchFilters: Filter,
  strict_match: boolean,
  isFilterEdited: (filterId: FilterType) => boolean
): NullableSearchFilter {
  return {
    time:
      searchMode.filters.includes("time") && isFilterEdited("time")
        ? searchFilters.time
        : null,
    department:
      searchMode.filters.includes("dept") && isFilterEdited("dept")
        ? searchFilters.department
        : null,
    enroll_method:
      searchMode.filters.includes("enroll_method") &&
      isFilterEdited("enroll_method")
        ? searchFilters.enroll_method
        : null,
    target_grade:
      searchMode.filters.includes("target_grade") &&
      isFilterEdited("target_grade")
        ? searchFilters.target_grade
        : null,
    other_limit:
      searchMode.filters.includes("other_limit") &&
      isFilterEdited("other_limit")
        ? searchFilters.other_limit
        : null,
    general_course_type:
      searchMode.filters.includes("general_course_type") &&
      isFilterEdited("general_course_type")
        ? searchFilters.general_course_type
        : null,
    common_target_department:
      searchMode.filters.includes("common_target_dept") &&
      isFilterEdited("common_target_dept")
        ? searchFilters.common_target_department
        : null,
    common_course_type:
      searchMode.filters.includes("common_course_type") &&
      isFilterEdited("common_course_type")
        ? searchFilters.common_course_type
        : null,
    pearmy_course_type:
      searchMode.filters.includes("pearmy_course_type") &&
      isFilterEdited("pearmy_course_type")
        ? searchFilters.pearmy_course_type
        : null,
    host_college:
      searchMode.filters.includes("host_college") &&
      isFilterEdited("host_college")
        ? searchFilters.host_college
        : null,
    program:
      searchMode.filters.includes("program") && isFilterEdited("program")
        ? searchFilters.program
        : null,
    is_full_year:
      searchMode.filters.includes("time") && isFilterEdited("time")
        ? searchFilters.is_full_year
        : null,
    is_selective:
      searchMode.filters.includes("dept") && isFilterEdited("dept")
        ? searchFilters.is_selective
        : null,
    strict_match: strict_match,
  };
}

export default function useSearchResult(
  searchKeyword: string | null,
  pageIndex: number
) {
  const toast = useToast();
  const {
    searchColumns,
    searchSettings,
    searchFilters,
    batchSize,
    searchSemester,
    sortOption,
    searchMode,
    isFilterEdited,
    setNumOfPages,
    setTotalCount,
  } = useCourseSearchingContext();
  const { data, error, isValidating, mutate } = useSWR(
    searchKeyword !== null
      ? [
          `/api/search/${searchKeyword}/${pageIndex}/${batchSize}/${sortOption}/${searchSemester}`,
          searchFilters,
        ]
      : null,
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
      const filters = generateSearchAPIFilterObject(
        searchMode,
        searchFilters,
        searchSettings.strict_search_mode,
        isFilterEdited
      );
      const coursesData = await fetchSearchResult(
        searchKeyword ?? "",
        searchColumns,
        filters,
        batchSize,
        pageIndex * batchSize,
        searchSemester
      );
      return coursesData;
    },
    {
      onSuccess: (d, k, c) => {
        // update total count && total number of pages
        const numOfCourses = d.total_count;
        setTotalCount(numOfCourses);
        setNumOfPages(Math.ceil(numOfCourses / batchSize));
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
    isLoading:
      searchKeyword === null ? false : (!data && !error) || isValidating,
    error,
    mutate,
  };
}
