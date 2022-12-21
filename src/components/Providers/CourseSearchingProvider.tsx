import searchModeList, { SearchMode } from "@/data/searchMode";
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import type {
  SearchFieldName,
  Filter,
  SortOption,
  FilterComponentId,
} from "types/search";
import { sortOptions } from "types/search";
import {
  isEnrollMethodFilterActive,
  isGeneralCourseTypeFilterActive,
  isCommonCourseTypeFilterActive,
  isCommonTargetDeptFilterActive,
  isPeArmyCourseTypeFilterActive,
} from "utils/searchFilter";
import { mapStateToIntervals } from "utils/timeTableConverter";

interface CourseSearchingContextType {
  search: string | null;
  setSearch: (search: string | null) => void;
  numOfPages: number;
  setNumOfPages: (pageNumber: number) => void;
  pageIndex: number;
  setPageIndex: (pageIndex: number) => void;
  totalCount: number;
  setTotalCount: (totalCount: number) => void;
  batchSize: number;
  setBatchSize: (batchSize: number) => void;
  searchColumns: SearchFieldName[]; // deprecated
  setSearchColumns: (searchColumns: SearchFieldName[]) => void; // deprecated
  searchFilters: Filter;
  setSearchFilters: (searchFilters: Filter) => void;
  searchSemester: string | null;
  setSearchSemester: (searchSemester: string | null) => void;
  searchMode: SearchMode;
  setSearchMode: (searchMode: SearchMode) => void;
  sortOption: SortOption;
  setSortOption: (sortOption: SortOption) => void;
  isSearchBoxInView: boolean;
  setIsSearchBoxInView: (isSearchBoxInView: boolean) => void;
  dispatchSearch: (search: string | null) => void;
  resetFilters: () => void;
  isFiltersEdited: boolean;
  isFilterEdited: (filterComponentId: FilterComponentId) => boolean;
  searchPageTopRef: React.RefObject<HTMLDivElement>;
  searchCallback: () => void;
}

const emptyFilterObject: Filter = {
  time: [[], [], [], [], [], [], []],
  department: [],
  enroll_method: [],
  isEnglishTaught: false,
  isDistanceLearning: false,
  hasChanged: false,
  isAdditionalCourse: false,
  noPrerequisite: false,
  noConflictOnly: false,
  notEnrolledOnly: false,
  generalCourseTypes: [],
  commonTargetDepartments: [],
  commonCourseTypes: [],
  peArmyCourseTypes: [],
  host_college: [],
  program: [],
  is_full_year: null,
  isCompulsory: null,
  time_strict_match: false,
  grouping_course_type: [],
  dept: null,
  department_course_type: null,
  singleDeptIsCompulsory: null,
  suggestedGrade: null,
};

const defaultSearchMode = searchModeList[0];
const defaultSortOption = sortOptions[0];

const CourseSearchingContext = createContext<CourseSearchingContextType>({
  search: "",
  numOfPages: 0,
  pageIndex: 0,
  totalCount: 0,
  batchSize: 20,
  searchColumns: ["name", "teacher", "serial", "code", "identifier"], // deprecated
  searchFilters: emptyFilterObject,
  searchSemester: "",
  searchMode: defaultSearchMode,
  isSearchBoxInView: true,
  isFilterEdited: () => false,
  isFiltersEdited: false,
  sortOption: defaultSortOption.id,
  searchPageTopRef: React.createRef(),
  searchCallback: () => {},
  setSearch: () => {},
  setNumOfPages: () => {},
  setPageIndex: () => {},
  setTotalCount: () => {},
  setBatchSize: () => {},
  setSearchColumns: () => {}, // deprecated
  setSearchFilters: () => {},
  setSearchSemester: () => {},
  setSearchMode: () => {},
  setIsSearchBoxInView: () => {},
  dispatchSearch: () => {},
  resetFilters: () => {},
  setSortOption: () => {},
});

const CourseSearchingProvider: React.FC<{
  readonly children: React.ReactNode;
}> = ({ children }) => {
  const [search, setSearch] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0); // total number of courses
  const [numOfPages, setNumOfPages] = useState(0); // total number of pages
  const [pageIndex, setPageIndex] = useState(0); // current page index
  const [batchSize, setBatchSize] = useState(50);

  // deprecated
  const [searchColumns, setSearchColumns] = useState<SearchFieldName[]>([
    "name",
    "teacher",
    "serial",
    "code",
    "identifier",
  ]);
  const [searchFilters, setSearchFilters] = useState<Filter>(emptyFilterObject);
  const [searchSemester, setSearchSemester] = useState(
    process.env.NEXT_PUBLIC_SEMESTER ?? null
  );
  const [searchMode, setSearchMode] = useState<SearchMode>(searchModeList[0]);
  const [sortOption, setSortOption] = useState<SortOption>(
    defaultSortOption.id
  );
  const [isSearchBoxInView, setIsSearchBoxInView] = useState(true);

  const dispatchSearch = (text: string | null) => {
    setSearch(text);
    setPageIndex(0);
  };

  const resetFilters = () => {
    setSearchFilters(emptyFilterObject);
  };

  const isFilterEdited = useCallback(
    (filterComponentId: FilterComponentId) => {
      // enumerate all the filter types
      switch (filterComponentId) {
        case "time": {
          return (
            mapStateToIntervals(searchFilters.time) > 0 ||
            searchFilters.is_full_year !== null
          );
        }
        case "dept": {
          return (
            searchFilters.department.length > 0 ||
            searchFilters.isCompulsory !== null
          );
        }
        case "enroll_method": {
          return isEnrollMethodFilterActive(searchFilters.enroll_method);
        }
        case "other_limit": {
          return (
            searchFilters.isEnglishTaught ||
            searchFilters.isDistanceLearning ||
            searchFilters.hasChanged ||
            searchFilters.isAdditionalCourse ||
            searchFilters.noPrerequisite ||
            searchFilters.noConflictOnly ||
            searchFilters.notEnrolledOnly
          );
        }
        case "general_course_type": {
          return isGeneralCourseTypeFilterActive(
            searchFilters.generalCourseTypes
          );
        }
        case "common_target_dept": {
          return isCommonTargetDeptFilterActive(
            searchFilters.commonTargetDepartments
          );
        }
        case "common_course_type": {
          return isCommonCourseTypeFilterActive(
            searchFilters.commonCourseTypes
          );
        }
        case "pearmy_course_type": {
          return isPeArmyCourseTypeFilterActive(
            searchFilters.peArmyCourseTypes
          );
        }
        case "host_college": {
          return searchFilters.host_college.length > 0;
        }
        case "program": {
          return searchFilters.program.length > 0;
        }
        case "grouping_course_type": {
          return searchFilters.grouping_course_type.length > 0;
        }
        case "single_dept": {
          return (
            searchFilters.dept !== null ||
            searchFilters.department_course_type !== null ||
            searchFilters.singleDeptIsCompulsory !== null ||
            searchFilters.suggestedGrade !== null
          );
        }
        default: {
          return false;
        }
      }
    },
    [searchFilters]
  );

  const isFiltersEdited = useMemo(() => {
    return Object.values(searchMode.filters).some((filterId) =>
      isFilterEdited(filterId)
    );
  }, [searchMode, isFilterEdited]);

  const searchPageTopRef = useRef<HTMLDivElement>(null);
  const searchCallback = () => {
    if (searchPageTopRef.current) {
      searchPageTopRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <CourseSearchingContext.Provider
      value={{
        search,
        numOfPages,
        pageIndex,
        totalCount,
        batchSize,
        searchColumns,
        searchFilters,
        searchSemester,
        searchMode,
        isSearchBoxInView,
        isFilterEdited,
        isFiltersEdited,
        sortOption,
        searchPageTopRef,
        searchCallback,
        setSearch,
        setNumOfPages,
        setPageIndex,
        setBatchSize,
        setSearchColumns,
        setSearchFilters,
        setTotalCount,
        setSearchSemester,
        setSearchMode,
        dispatchSearch,
        resetFilters,
        setSortOption,
        setIsSearchBoxInView,
      }}
    >
      {children}
    </CourseSearchingContext.Provider>
  );
};

function useCourseSearchingContext() {
  return useContext(CourseSearchingContext);
}

export { CourseSearchingProvider, useCourseSearchingContext };
