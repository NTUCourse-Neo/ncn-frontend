import useSWR from "swr";
import { fetchSearchResult } from "queries/course";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";
import { useToast } from "@chakra-ui/react";
import type { NullableSearchFilter } from "queries/course";
import { SearchMode } from "@/data/searchMode";
import { Filter, FilterComponentId } from "@/types/search";

// generate filter for search API, only current searchMode-related filter will be used, otherwise null.
// if it is not edited, then it will also be null
function generateSearchAPIFilterObject(
  searchMode: SearchMode,
  searchFilters: Filter,
  isFilterEdited: (filterId: FilterComponentId) => boolean
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
    englishOnly: searchMode.filters.includes("other_limit")
      ? searchFilters.englishOnly
      : null,
    remoteOnly: searchMode.filters.includes("other_limit")
      ? searchFilters.remoteOnly
      : null,
    changeOnly: searchMode.filters.includes("other_limit")
      ? searchFilters.changeOnly
      : null,
    addOnly: searchMode.filters.includes("other_limit")
      ? searchFilters.addOnly
      : null,
    noConflictOnly: searchMode.filters.includes("other_limit")
      ? searchFilters.noConflictOnly
      : null,
    noPrerequisiteOnly: searchMode.filters.includes("other_limit")
      ? searchFilters.noPrerequisiteOnly
      : null,
    notEnrolledOnly: searchMode.filters.includes("other_limit")
      ? searchFilters.notEnrolledOnly
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
    grouping_course_type:
      searchMode.filters.includes("grouping_course_type") &&
      isFilterEdited("grouping_course_type")
        ? searchFilters.grouping_course_type
        : null,
    is_full_year:
      searchMode.filters.includes("time") && isFilterEdited("time")
        ? searchFilters.is_full_year
        : null,
    isCompulsory:
      searchMode.filters.includes("dept") && isFilterEdited("dept")
        ? searchFilters.isCompulsory
        : null,
    time_strict_match:
      searchMode.filters.includes("time") && isFilterEdited("time")
        ? searchFilters.time_strict_match
        : null,
    dept:
      searchMode.filters.includes("single_dept") &&
      isFilterEdited("single_dept")
        ? searchFilters.dept
        : null,
    department_course_type:
      searchMode.filters.includes("single_dept") &&
      isFilterEdited("single_dept")
        ? searchFilters.department_course_type
        : null,
    singleDeptIsSelective:
      searchMode.filters.includes("single_dept") &&
      isFilterEdited("single_dept")
        ? searchFilters.singleDeptIsSelective
        : null,
    suggestedGrade:
      searchMode.filters.includes("single_dept") &&
      isFilterEdited("single_dept")
        ? searchFilters.suggestedGrade
        : null,
  };
}

export default function useSearchResult(
  searchKeyword: string | null,
  pageIndex: number
) {
  const toast = useToast();
  const {
    searchColumns,
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
