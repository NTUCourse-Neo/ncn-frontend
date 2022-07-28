import React, { createContext, useContext, useState } from "react";

const CourseSearchingContext = createContext({
  search: "",
  pageNumber: 0,
  searchResultCount: 0,
  searchLoading: false,
  searchError: null,
  totalCount: 0, // total number of results
  batchSize: 20,
  offset: 0,
  searchColumns: ["course_name", "teacher"], // array of column names, default is all columns
  searchSettings: {
    show_selected_courses: false,
    only_show_not_conflicted_courses: false,
    sync_add_to_nol: false,
    strict_search_mode: true,
  }, // object of settings
  searchFiltersEnable: {
    time: false,
    department: false,
    category: false,
    enroll_method: false,
  }, // object of boolean, enable/disable filters
  searchFilters: {
    time: [[], [], [], [], [], [], []],
    department: [],
    category: [],
    enroll_method: ["1", "2", "3"],
  }, // default value of filters
  setSearch: () => {},
  setPageNumber: () => {},
  setSearchLoading: () => {},
  setSearchResultCount: () => {},
  setSearchError: () => {},
  setOffset: () => {},
  setTotalCount: () => {},
  setBatchSize: () => {},
  setSearchSettings: () => {},
  setSearchColumns: () => {},
  setSearchFiltersEnable: () => {},
  setSearchFilters: () => {},
});

function CourseSearchingProvider(props) {
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [searchResultCount, setSearchResultCount] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [batchSize, setBatchSize] = useState(20);
  const [searchColumns, setSearchColumns] = useState([
    "name",
    "teacher",
    "serial",
    "code",
    "identifier",
  ]);
  const [searchSettings, setSearchSettings] = useState({
    show_selected_courses: false,
    only_show_not_conflicted_courses: false,
    sync_add_to_nol: false,
    strict_search_mode: true,
  });
  const [searchFiltersEnable, setSearchFiltersEnable] = useState({
    time: false,
    department: false,
    category: false,
    enroll_method: false,
  });
  const [searchFilters, setSearchFilters] = useState({
    time: [[], [], [], [], [], [], []],
    department: [],
    category: [],
    enroll_method: ["1", "2", "3"],
  });

  const fetchNextPage = () => {
    setPageNumber(pageNumber + 1);
  };

  const dispatchSearch = (text) => {
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
        fetchNextPage,
        dispatchSearch,
      }}
      {...props}
    />
  );
}

function useCourseSearchingContext() {
  return useContext(CourseSearchingContext);
}

export { CourseSearchingProvider, useCourseSearchingContext };
