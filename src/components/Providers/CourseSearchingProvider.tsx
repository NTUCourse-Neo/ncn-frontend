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
  FilterType,
} from "types/search";
import {
  isEnrollMethodFilterActive,
  isTargetGradeFilterActive,
  isGeneralCourseTypeFilterActive,
  isCommonCourseTypeFilterActive,
  isCommonTargetDeptFilterActive,
  isPeArmyCourseTypeFilterActive,
} from "utils/searchFilter";
import { mapStateToIntervals } from "utils/timeTableConverter";

export interface SearchConfigType {
  show_selected_courses: boolean;
  only_show_not_conflicted_courses: boolean;
  sync_add_to_nol: boolean;
  strict_search_mode: boolean;
}

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
  searchSettings: SearchConfigType;
  setSearchSettings: (searchSettings: SearchConfigType) => void; // only strict_search_mode is used
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
  isFilterEdited: (filterType: FilterType) => boolean;
  searchPageTopRef: React.RefObject<HTMLDivElement>;
  searchCallback: () => void;
}

const emptyFilterObject: Filter = {
  time: [[], [], [], [], [], [], []],
  department: [],
  target_grade: [],
  enroll_method: [],
  other_limit: [],
  general_course_type: [],
  common_target_department: [],
  common_course_type: [],
  pearmy_course_type: [],
  host_college: [],
  program: [],
  is_full_year: null,
  is_selective: null,
};

const defaultSearchMode = searchModeList[0];

const CourseSearchingContext = createContext<CourseSearchingContextType>({
  search: "",
  numOfPages: 0,
  pageIndex: 0,
  totalCount: 0,
  batchSize: 20,
  searchColumns: ["name", "teacher", "serial", "code", "identifier"], // deprecated
  searchSettings: {
    // only strict_search_mode is used
    show_selected_courses: false,
    only_show_not_conflicted_courses: false,
    sync_add_to_nol: false,
    strict_search_mode: false,
  },
  searchFilters: emptyFilterObject,
  searchSemester: "",
  searchMode: defaultSearchMode,
  isSearchBoxInView: true,
  isFilterEdited: () => false,
  isFiltersEdited: false,
  sortOption: "serial",
  searchPageTopRef: React.createRef(),
  searchCallback: () => {},
  setSearch: () => {},
  setNumOfPages: () => {},
  setPageIndex: () => {},
  setTotalCount: () => {},
  setBatchSize: () => {},
  setSearchSettings: () => {},
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
  // only strict_search_mode is used
  const [searchSettings, setSearchSettings] = useState<SearchConfigType>({
    show_selected_courses: false,
    only_show_not_conflicted_courses: false,
    sync_add_to_nol: false,
    strict_search_mode: false,
  });
  const [searchFilters, setSearchFilters] = useState<Filter>(emptyFilterObject);
  const [searchSemester, setSearchSemester] = useState(
    process.env.NEXT_PUBLIC_SEMESTER ?? null
  );
  const [searchMode, setSearchMode] = useState<SearchMode>(searchModeList[0]);
  const [sortOption, setSortOption] = useState<SortOption>("serial");
  const [isSearchBoxInView, setIsSearchBoxInView] = useState(true);

  const dispatchSearch = (text: string | null) => {
    setSearch(text);
    setPageIndex(0);
  };

  const resetFilters = () => {
    setSearchFilters(emptyFilterObject);
  };

  const isFilterEdited = useCallback(
    (filterId: FilterType) => {
      // enumerate all the filter types
      switch (filterId) {
        case "time": {
          return (
            mapStateToIntervals(searchFilters.time) > 0 ||
            searchFilters.is_full_year !== null
          );
        }
        case "dept": {
          return (
            searchFilters.department.length > 0 ||
            searchFilters.is_selective !== null
          );
        }
        case "enroll_method": {
          return isEnrollMethodFilterActive(searchFilters.enroll_method);
        }
        case "target_grade": {
          return isTargetGradeFilterActive(searchFilters.target_grade);
        }
        case "other_limit": {
          return searchFilters.other_limit.length > 0;
        }
        case "general_course_type": {
          return isGeneralCourseTypeFilterActive(
            searchFilters.general_course_type
          );
        }
        case "common_target_dept": {
          return isCommonTargetDeptFilterActive(
            searchFilters.common_target_department
          );
        }
        case "common_course_type": {
          return isCommonCourseTypeFilterActive(
            searchFilters.common_course_type
          );
        }
        case "pearmy_course_type": {
          return isPeArmyCourseTypeFilterActive(
            searchFilters.pearmy_course_type
          );
        }
        case "host_college": {
          return searchFilters.host_college.length > 0;
        }
        case "program": {
          return searchFilters.program.length > 0;
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
        searchSettings,
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
        setSearchSettings,
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
