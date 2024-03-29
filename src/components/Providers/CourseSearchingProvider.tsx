import React, { createContext, useContext, useState } from "react";
import type { SearchFieldName, FilterEnable, Filter } from "types/search";

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
  searchColumns: SearchFieldName[];
  setSearchColumns: (searchColumns: SearchFieldName[]) => void;
  searchSettings: SearchConfigType;
  setSearchSettings: (searchSettings: SearchConfigType) => void;
  searchFiltersEnable: FilterEnable;
  setSearchFiltersEnable: (searchFiltersEnable: FilterEnable) => void;
  searchFilters: Filter;
  setSearchFilters: (searchFilters: Filter) => void;
  searchSemester: string | null;
  setSearchSemester: (searchSemester: string | null) => void;
  fetchNextPage: () => void;
  dispatchSearch: (search: string | null) => void;
}

const CourseSearchingContext = createContext<CourseSearchingContextType>({
  search: "",
  pageNumber: 0,
  searchResultCount: 0,
  searchLoading: false,
  totalCount: 0,
  batchSize: 20,
  searchColumns: ["name", "teacher", "serial", "code", "identifier"],
  searchSettings: {
    show_selected_courses: false,
    only_show_not_conflicted_courses: false,
    sync_add_to_nol: false,
    strict_search_mode: true,
  },
  searchFiltersEnable: {
    time: false,
    department: false,
    category: false,
    enroll_method: false,
  },
  searchFilters: {
    time: [[], [], [], [], [], [], []],
    department: [],
    category: [],
    enroll_method: ["1", "2", "3"],
  },
  searchSemester: "",
  setSearch: () => {},
  setPageNumber: () => {},
  setSearchLoading: () => {},
  setSearchResultCount: () => {},
  setTotalCount: () => {},
  setBatchSize: () => {},
  setSearchSettings: () => {},
  setSearchColumns: () => {},
  setSearchFiltersEnable: () => {},
  setSearchFilters: () => {},
  setSearchSemester: () => {},
  fetchNextPage: () => {},
  dispatchSearch: () => {},
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
  const [searchColumns, setSearchColumns] = useState<SearchFieldName[]>([
    "name",
    "teacher",
    "serial",
    "code",
    "identifier",
  ]);
  const [searchSettings, setSearchSettings] = useState<SearchConfigType>({
    show_selected_courses: false,
    only_show_not_conflicted_courses: false,
    sync_add_to_nol: false,
    strict_search_mode: true,
  });
  const [searchFiltersEnable, setSearchFiltersEnable] = useState<FilterEnable>({
    time: false,
    department: false,
    category: false,
    enroll_method: false,
  });
  const [searchFilters, setSearchFilters] = useState<Filter>({
    time: [[], [], [], [], [], [], []],
    department: [],
    category: [],
    enroll_method: ["1", "2", "3"],
  });
  const [searchSemester, setSearchSemester] = useState(
    process.env.NEXT_PUBLIC_SEMESTER ?? null
  );

  const fetchNextPage = () => {
    setPageNumber(pageNumber + 1);
  };

  const dispatchSearch = (text: string | null) => {
    setSearch(text);
    setSearchResultCount(0);
    setPageNumber(1);
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
        searchFiltersEnable,
        searchFilters,
        searchSemester,
        setSearch,
        setPageNumber,
        setBatchSize,
        setSearchSettings,
        setSearchColumns,
        setSearchFiltersEnable,
        setSearchFilters,
        setSearchLoading,
        setSearchResultCount,
        setTotalCount,
        setSearchSemester,
        fetchNextPage,
        dispatchSearch,
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
