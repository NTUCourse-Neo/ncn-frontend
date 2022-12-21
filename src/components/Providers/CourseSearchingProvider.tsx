import searchModeList, { SearchMode } from "@/data/searchMode";
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import type { Filter, SortOption, FilterComponentId } from "types/search";
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
  courseProviders: [],
  programs: [],
  isFullYear: null,
  isCompulsory: null,
  timeStrictMatch: false,
  groupingCourseTypes: [],
  dept: null,
  departmentCourseType: null,
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
            searchFilters.isFullYear !== null
          );
        }
        case "dept": {
          return (
            searchFilters.department.length > 0 ||
            searchFilters.isCompulsory !== null
          );
        }
        case "enrollMethod": {
          return isEnrollMethodFilterActive(searchFilters.enroll_method);
        }
        case "otherLimit": {
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
        case "generalCourseType": {
          return isGeneralCourseTypeFilterActive(
            searchFilters.generalCourseTypes
          );
        }
        case "commonTargetDept": {
          return isCommonTargetDeptFilterActive(
            searchFilters.commonTargetDepartments
          );
        }
        case "commonCourseType": {
          return isCommonCourseTypeFilterActive(
            searchFilters.commonCourseTypes
          );
        }
        case "peArmyCourseType": {
          return isPeArmyCourseTypeFilterActive(
            searchFilters.peArmyCourseTypes
          );
        }
        case "courseProvider": {
          return searchFilters.courseProviders.length > 0;
        }
        case "program": {
          return searchFilters.programs.length > 0;
        }
        case "groupingCourseType": {
          return searchFilters.groupingCourseTypes.length > 0;
        }
        case "singleDept": {
          return (
            searchFilters.dept !== null ||
            searchFilters.departmentCourseType !== null ||
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
