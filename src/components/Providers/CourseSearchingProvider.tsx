import searchModeList, { SearchMode } from "@/data/searchMode";
import React, { createContext, useContext, useState, useRef } from "react";
import type { SearchFieldName, Filter, SortOption } from "types/search";
import {
  isEnrollMethodFilterActive,
  isTargetGradeFilterActive,
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
  searchLoading: boolean;
  setSearchLoading: (searchLoading: boolean) => void;
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
  is_full_year: null,
  is_selective: null,
};

const CourseSearchingContext = createContext<CourseSearchingContextType>({
  search: "",
  numOfPages: 0,
  pageIndex: 0,
  searchLoading: false,
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
  searchMode: {
    id: "fast",
    chinese: "快速搜尋",
    english: "Quick Search",
  },
  isSearchBoxInView: true,
  isFiltersEdited: false,
  sortOption: "correlation",
  searchPageTopRef: React.createRef(),
  searchCallback: () => {},
  setSearch: () => {},
  setNumOfPages: () => {},
  setPageIndex: () => {},
  setSearchLoading: () => {},
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
  const [searchLoading, setSearchLoading] = useState(false);
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
  const [sortOption, setSortOption] = useState<SortOption>("correlation");
  const [isSearchBoxInView, setIsSearchBoxInView] = useState(true);

  const dispatchSearch = (text: string | null) => {
    setSearch(text);
    setPageIndex(0);
  };

  const resetFilters = () => {
    setSearchFilters(emptyFilterObject);
  };

  const isFiltersEdited =
    mapStateToIntervals(searchFilters.time) > 0 ||
    searchFilters.department.length > 0 ||
    isEnrollMethodFilterActive(searchFilters.enroll_method) ||
    isTargetGradeFilterActive(searchFilters.target_grade) ||
    searchFilters.other_limit.length > 0 ||
    searchFilters.is_full_year !== null ||
    searchFilters.is_selective !== null;

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
        searchLoading,
        totalCount,
        batchSize,
        searchColumns,
        searchSettings,
        searchFilters,
        searchSemester,
        searchMode,
        isSearchBoxInView,
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
        setSearchLoading,
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
