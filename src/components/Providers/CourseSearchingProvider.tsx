import type { SearchMode } from "@/data/searchMode";
import React, { createContext, useContext, useState } from "react";
import type { SearchFieldName, Filter } from "types/search";

export interface SearchConfigType {
  show_selected_courses: boolean;
  only_show_not_conflicted_courses: boolean;
  sync_add_to_nol: boolean;
  strict_search_mode: boolean;
}

interface CourseSearchingContextType {
  search: string | null;
  setSearch: (search: string | null) => void;
  pageNumber: number;
  setPageNumber: (pageNumber: number) => void;
  searchResultCount: number;
  setSearchResultCount: (searchResultCount: number) => void;
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
  fetchNextPage: () => void;
  dispatchSearch: (search: string | null) => void;
  resetFilters: () => void;
}

const CourseSearchingContext = createContext<CourseSearchingContextType>({
  search: "",
  pageNumber: 0,
  searchResultCount: 0,
  searchLoading: false,
  totalCount: 0,
  batchSize: 20,
  searchColumns: ["name", "teacher", "serial", "code", "identifier"], // deprecated
  searchSettings: {
    // only strict_search_mode is used
    show_selected_courses: false,
    only_show_not_conflicted_courses: false,
    sync_add_to_nol: false,
    strict_search_mode: true,
  },
  searchFilters: {
    time: [[], [], [], [], [], [], []],
    department: [],
    target_grade: [],
    enroll_method: ["1", "2", "3"],
    other_limit: [],
    is_full_year: null,
    is_selective: null,
  },
  searchSemester: "",
  searchMode: {
    id: "fast",
    chinese: "快速搜尋",
    english: "Quick Search",
  },
  setSearch: () => {},
  setPageNumber: () => {},
  setSearchLoading: () => {},
  setSearchResultCount: () => {},
  setTotalCount: () => {},
  setBatchSize: () => {},
  setSearchSettings: () => {},
  setSearchColumns: () => {}, // deprecated
  setSearchFilters: () => {},
  setSearchSemester: () => {},
  setSearchMode: () => {},
  fetchNextPage: () => {},
  dispatchSearch: () => {},
  resetFilters: () => {},
});

const CourseSearchingProvider: React.FC<{
  readonly children: React.ReactNode;
}> = ({ children }) => {
  const [search, setSearch] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [searchResultCount, setSearchResultCount] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [batchSize, setBatchSize] = useState(20);

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
    strict_search_mode: true,
  });
  const [searchFilters, setSearchFilters] = useState<Filter>({
    time: [[], [], [], [], [], [], []],
    department: [],
    target_grade: [],
    enroll_method: ["1", "2", "3"],
    other_limit: [],
    is_full_year: null,
    is_selective: null,
  });
  const [searchSemester, setSearchSemester] = useState(
    process.env.NEXT_PUBLIC_SEMESTER ?? null
  );
  const [searchMode, setSearchMode] = useState<SearchMode>({
    id: "fast",
    chinese: "快速搜尋",
    english: "Quick Search",
  });

  const fetchNextPage = () => {
    setPageNumber(pageNumber + 1);
  };

  const dispatchSearch = (text: string | null) => {
    setSearch(text);
    setSearchResultCount(0);
    setPageNumber(1);
  };

  const resetFilters = () => {
    setSearchFilters({
      time: [[], [], [], [], [], [], []],
      department: [],
      target_grade: [],
      enroll_method: ["1", "2", "3"],
      other_limit: [],
      is_full_year: null,
      is_selective: null,
    });
  };

  return (
    <CourseSearchingContext.Provider
      value={{
        search,
        pageNumber,
        searchResultCount,
        searchLoading,
        totalCount,
        batchSize,
        searchColumns,
        searchSettings,
        searchFilters,
        searchSemester,
        searchMode,
        setSearch,
        setPageNumber,
        setBatchSize,
        setSearchSettings,
        setSearchColumns,
        setSearchFilters,
        setSearchLoading,
        setSearchResultCount,
        setTotalCount,
        setSearchSemester,
        setSearchMode,
        fetchNextPage,
        dispatchSearch,
        resetFilters,
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
