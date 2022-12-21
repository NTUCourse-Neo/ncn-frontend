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
      searchMode.filters.includes("enrollMethod") &&
      isFilterEdited("enrollMethod")
        ? searchFilters.enroll_method
        : null,
    isEnglishTaught: searchMode.filters.includes("otherLimit")
      ? searchFilters.isEnglishTaught
      : null,
    isDistanceLearning: searchMode.filters.includes("otherLimit")
      ? searchFilters.isDistanceLearning
      : null,
    hasChanged: searchMode.filters.includes("otherLimit")
      ? searchFilters.hasChanged
      : null,
    isAdditionalCourse: searchMode.filters.includes("otherLimit")
      ? searchFilters.isAdditionalCourse
      : null,
    noConflictOnly: searchMode.filters.includes("otherLimit")
      ? searchFilters.noConflictOnly
      : null,
    noPrerequisite: searchMode.filters.includes("otherLimit")
      ? searchFilters.noPrerequisite
      : null,
    notEnrolledOnly: searchMode.filters.includes("otherLimit")
      ? searchFilters.notEnrolledOnly
      : null,
    generalCourseTypes:
      searchMode.filters.includes("generalCourseType") &&
      isFilterEdited("generalCourseType")
        ? searchFilters.generalCourseTypes
        : null,
    commonTargetDepartments:
      searchMode.filters.includes("commonTargetDept") &&
      isFilterEdited("commonTargetDept")
        ? searchFilters.commonTargetDepartments
        : null,
    commonCourseTypes:
      searchMode.filters.includes("commonCourseType") &&
      isFilterEdited("commonCourseType")
        ? searchFilters.commonCourseTypes
        : null,
    peArmyCourseTypes:
      searchMode.filters.includes("peArmyCourseType") &&
      isFilterEdited("peArmyCourseType")
        ? searchFilters.peArmyCourseTypes
        : null,
    courseProviders:
      searchMode.filters.includes("courseProvider") &&
      isFilterEdited("courseProvider")
        ? searchFilters.courseProviders
        : null,
    programs:
      searchMode.filters.includes("program") && isFilterEdited("program")
        ? searchFilters.programs
        : null,
    groupingCourseTypes:
      searchMode.filters.includes("groupingCourseType") &&
      isFilterEdited("groupingCourseType")
        ? searchFilters.groupingCourseTypes
        : null,
    isFullYear:
      searchMode.filters.includes("time") && isFilterEdited("time")
        ? searchFilters.isFullYear
        : null,
    isCompulsory:
      searchMode.filters.includes("dept") && isFilterEdited("dept")
        ? searchFilters.isCompulsory
        : null,
    timeStrictMatch:
      searchMode.filters.includes("time") && isFilterEdited("time")
        ? searchFilters.timeStrictMatch
        : null,
    dept:
      searchMode.filters.includes("singleDept") && isFilterEdited("singleDept")
        ? searchFilters.dept
        : null,
    departmentCourseType:
      searchMode.filters.includes("singleDept") && isFilterEdited("singleDept")
        ? searchFilters.departmentCourseType
        : null,
    singleDeptIsCompulsory:
      searchMode.filters.includes("singleDept") && isFilterEdited("singleDept")
        ? searchFilters.singleDeptIsCompulsory
        : null,
    suggestedGrade:
      searchMode.filters.includes("singleDept") && isFilterEdited("singleDept")
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
