import searchModeList, {
  BaseQueryType,
  DeptQueryType,
  FastQueryType,
  GeneralQueryType,
  CommonQueryType,
  PeArmyQueryType,
  ProgramQueryType,
  ExpertiseQueryType,
  InterschoolQueryType,
  IntensiveQueryType,
  EnglishQueryType,
  GroupingQueryType,
  SearchMode,
} from "@/types/searchMode";
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import type { Filter, FilterComponentId } from "@/types/filter";
import {
  isEnrollMethodFilterActive,
  isGeneralCourseTypeFilterActive,
  isCommonCourseTypeFilterActive,
  isCommonTargetDeptFilterActive,
  isPeArmyCourseTypeFilterActive,
} from "utils/searchFilter";
import { mapStateToIntervals } from "utils/timeTableConverter";
import { assertNever } from "@/utils/assert";

// for sorting
export const sortOptions = [
  {
    id: "correlation",
    chinese: "相關性",
    english: "Correlation",
  },
  {
    id: "limit_asc",
    chinese: "修課總人數 (遞增)",
    english: "Enrollment Limit (Ascending)",
  },
  {
    id: "limit_desc",
    chinese: "修課總人數 (遞減)",
    english: "Enrollment Limit (Descending)",
  },
  {
    id: "credits_asc",
    chinese: "學分數 (遞增)",
    english: "Credits (Ascending)",
  },
  {
    id: "credits_desc",
    chinese: "學分數 (遞減)",
    english: "Credits (Descending)",
  },
] as const;
export type SortOption = typeof sortOptions[number]["id"];

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
  searchSemester: string;
  setSearchSemester: (searchSemester: string) => void;
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
  searchQuery:
    | FastQueryType
    | DeptQueryType
    | GeneralQueryType
    | CommonQueryType
    | PeArmyQueryType
    | ProgramQueryType
    | InterschoolQueryType
    | GroupingQueryType
    | ExpertiseQueryType
    | IntensiveQueryType
    | EnglishQueryType;
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
  searchQuery: {
    keyword: "",
    semester: "",
    time: emptyFilterObject.time,
    isFullYear: emptyFilterObject.isFullYear,
    timeStrictMatch: emptyFilterObject.timeStrictMatch,
    enrollMethod: emptyFilterObject.enroll_method,
    isEnglishTaught: emptyFilterObject.isEnglishTaught,
    isDistanceLearning: emptyFilterObject.isDistanceLearning,
    hasChanged: emptyFilterObject.hasChanged,
    isAdditionalCourse: emptyFilterObject.isAdditionalCourse,
    noPrerequisite: emptyFilterObject.noPrerequisite,
    noConflictOnly: emptyFilterObject.noConflictOnly,
    notEnrolledOnly: emptyFilterObject.notEnrolledOnly,
    department: emptyFilterObject.department,
    isCompulsory: emptyFilterObject.isCompulsory,
  },
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
  const [searchSemester, setSearchSemester] = useState(() => {
    if (process.env.NEXT_PUBLIC_SEMESTER) {
      return process.env.NEXT_PUBLIC_SEMESTER;
    } else {
      throw new Error("NEXT_PUBLIC_SEMESTER is not defined");
    }
  });
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

  // transform filters state, keyword, semester to query type
  const searchQuery = useMemo(() => {
    const baseQuery: BaseQueryType = {
      keyword: search as string,
      semester: searchSemester,
      time: searchFilters.time,
      isFullYear: searchFilters.isFullYear,
      timeStrictMatch: searchFilters.timeStrictMatch,
      isEnglishTaught: searchFilters.isEnglishTaught,
      isDistanceLearning: searchFilters.isDistanceLearning,
      hasChanged: searchFilters.hasChanged,
      isAdditionalCourse: searchFilters.isAdditionalCourse,
      noPrerequisite: searchFilters.noPrerequisite,
      noConflictOnly: searchFilters.noConflictOnly,
      notEnrolledOnly: searchFilters.notEnrolledOnly,
      enrollMethod: searchFilters.enroll_method,
    };
    switch (searchMode.id) {
      case "fast": {
        const fastQuery: FastQueryType = {
          ...baseQuery,
          department: searchFilters.department,
          isCompulsory: searchFilters.isCompulsory,
        };
        return fastQuery;
      }
      case "dept": {
        const singleDeptQuery: DeptQueryType = {
          ...baseQuery,
          department: searchFilters.dept?.id ?? null,
          departmentCourseType: searchFilters.departmentCourseType,
          isCompulsory: searchFilters.singleDeptIsCompulsory,
          suggestedGrade: searchFilters.suggestedGrade,
        };
        return singleDeptQuery;
      }
      case "general": {
        const generalQuery: GeneralQueryType = {
          ...baseQuery,
          generalCourseTypes: searchFilters.generalCourseTypes,
        };
        return generalQuery;
      }
      case "common": {
        const commonQuery: CommonQueryType = {
          ...baseQuery,
          commonTargetDepartments: searchFilters.commonTargetDepartments,
          commonCourseTypes: searchFilters.commonCourseTypes,
        };
        return commonQuery;
      }
      case "pearmy": {
        const peArmyQuery: PeArmyQueryType = {
          ...baseQuery,
          peArmyCourseTypes: searchFilters.peArmyCourseTypes,
        };
        return peArmyQuery;
      }
      case "program": {
        const programQuery: ProgramQueryType = {
          ...baseQuery,
          programs: searchFilters.programs,
        };
        return programQuery;
      }
      case "expertise": {
        const expertiseQuery: ExpertiseQueryType = {
          ...baseQuery,
          department: searchFilters.department,
          isCompulsory: searchFilters.isCompulsory,
        };
        return expertiseQuery;
      }
      case "interschool": {
        const interschoolQuery: InterschoolQueryType = {
          ...baseQuery,
          courseProviders: searchFilters.courseProviders,
        };
        return interschoolQuery;
      }
      case "grouping": {
        const groupingQuery: GroupingQueryType = {
          ...baseQuery,
          groupingCourseTypes: searchFilters.groupingCourseTypes,
        };
        return groupingQuery;
      }
      case "intensive": {
        const intensiveQuery: IntensiveQueryType = {
          ...baseQuery,
          department: searchFilters.department,
          isCompulsory: searchFilters.isCompulsory,
        };
        return intensiveQuery;
      }
      case "english": {
        const englishQuery: EnglishQueryType = {
          ...baseQuery,
          department: searchFilters.department,
          isCompulsory: searchFilters.isCompulsory,
        };
        return englishQuery;
      }
      default: {
        assertNever(searchMode.id);
      }
    }
  }, [searchMode, searchFilters, search, searchSemester]);

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
        searchQuery,
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
