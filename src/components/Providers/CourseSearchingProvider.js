import React, { createContext, useContext, useState } from "react";

const CourseSearchingContext = createContext({
  search: "",
  searchResult: [],
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
  setSearchLoading: () => {},
  setSearchResult: () => {},
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
  const [searchResult, setSearchResult] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [batchSize, setBatchSize] = useState(20);
  const [offset, setOffset] = useState(0);
  const [searchColumns, setSearchColumns] = useState(["name", "teacher"]);
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

  return (
    <CourseSearchingContext.Provider
      value={{
        search,
        searchResult,
        searchLoading,
        searchError,
        totalCount,
        batchSize,
        offset,
        searchColumns,
        searchSettings,
        searchFiltersEnable,
        searchFilters,
        setSearch,
        setBatchSize,
        setSearchSettings,
        setSearchColumns,
        setSearchFiltersEnable,
        setSearchFilters,
        setSearchLoading,
        setSearchResult,
        setSearchError,
        setOffset,
        setTotalCount,
      }}
      {...props}
    />
  );
}

function useCourseSearchingContext() {
  return useContext(CourseSearchingContext);
}

export { CourseSearchingProvider, useCourseSearchingContext };
