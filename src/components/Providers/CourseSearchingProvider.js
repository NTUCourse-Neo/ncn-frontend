import React, { createContext, useContext, useState } from "react";
import instance from "queries/axiosInstance";
import handleAPIError from "utils/handleAPIError";

const CourseSearchingContext = createContext({
  searchIds: [],
  searchResult: [],
  searchLoading: false,
  searchError: null,
  totalCount: 0, // total number of results
  batchSize: 20,
  offset: 0,
  searchColumns: ["course_name", "teacher"], // array of column names, default is all columns
  searchSettings: { show_selected_courses: false, only_show_not_conflicted_courses: false, sync_add_to_nol: false, strict_search_mode: false }, // object of settings
  searchFiltersEnable: { time: false, department: false, category: false, enroll_method: false }, // object of boolean, enable/disable filters
  searchFilters: { time: [[], [], [], [], [], [], []], department: [], category: [], enroll_method: ["1", "2", "3"] }, // default value of filters
  setBatchSize: () => {},
  setSearchSettings: () => {},
  setSearchColumns: () => {},
  setSearchFiltersEnable: () => {},
  setSearchFilters: () => {},
  fetchSearchIDs: () => {},
  fetchSearchResults: () => {},
  fetchCourse: () => {},
  getCourseEnrollInfo: () => {},
  getNTURatingData: () => {},
  getPTTData: () => {},
  getCourseSyllabusData: () => {},
  fetchCourseTableCoursesByIds: () => {},
  fetchFavoriteCourses: () => {},
});

function CourseSearchingProvider(props) {
  const [searchIds, setSearchIds] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [batchSize, setBatchSize] = useState(20);
  const [offset, setOffset] = useState(0);
  const [searchColumns, setSearchColumns] = useState(["course_name", "teacher"]);
  const [searchSettings, setSearchSettings] = useState({
    show_selected_courses: false,
    only_show_not_conflicted_courses: false,
    sync_add_to_nol: false,
    strict_search_mode: false,
  });
  const [searchFiltersEnable, setSearchFiltersEnable] = useState({ time: false, department: false, category: false, enroll_method: false });
  const [searchFilters, setSearchFilters] = useState({
    time: [[], [], [], [], [], [], []],
    department: [],
    category: [],
    enroll_method: ["1", "2", "3"],
  });

  const fetchSearchIDs = async (searchString, paths, filters_enable, filter_obj, batchSize, strict_match_bool) => {
    setSearchLoading(true);

    try {
      const {
        data: { ids },
      } = await instance.post(`/courses/search`, { query: searchString, paths: paths });
      // console.log(ids); // checking receive array of courses
      setSearchIds(ids);

      // fetch batch 0 first
      try {
        const search_filter = { ...filter_obj, strict_match: strict_match_bool };
        if (filters_enable.time === false) {
          search_filter.time = null;
        }
        if (filters_enable.department === false) {
          search_filter.department = null;
        }
        if (filters_enable.category === false) {
          search_filter.category = null;
        }
        if (filters_enable.enroll_method === false) {
          search_filter.enroll_method = null;
        }
        const {
          data: { courses, total_count },
        } = await instance.post(`/courses/ids`, { ids: ids, filter: search_filter, batch_size: batchSize, offset: 0 });
        setSearchResult(courses);
        setSearchLoading(false);
        setSearchError(null);
        // increment offset
        setOffset(batchSize);
        // update total_results count
        setTotalCount(total_count);
      } catch (error) {
        setSearchLoading(false);
        setSearchError(error);
        // console.log(Error("FETCH_SEARCH_RESULTS_FAILURE: "+error));
        throw error;
      }

      return ids;
    } catch (error) {
      setSearchLoading(false);
      setSearchError(error);
      // console.log(Error("FETCH_SEARCH_IDS_FAILURE: "+error))
      throw handleAPIError(error);
    }
  };

  const fetchSearchResults = async (ids_arr, filters_enable, filter_obj, batchSize, offset, strict_match_bool) => {
    setSearchLoading(true);

    try {
      const search_filter = { ...filter_obj, strict_match: strict_match_bool };
      if (filters_enable.time === false) {
        search_filter.time = null;
      }
      if (filters_enable.department === false) {
        search_filter.department = null;
      }
      if (filters_enable.category === false) {
        search_filter.category = null;
      }
      if (filters_enable.enroll_method === false) {
        search_filter.enroll_method = null;
      }
      const {
        data: { courses },
      } = await instance.post(`/courses/ids`, { ids: ids_arr, filter: search_filter, batch_size: batchSize, offset: offset });
      // console.log(courses); // checking receive array of courses
      setSearchResult([...searchResult, ...courses]);
      setSearchLoading(false);
      setSearchError(null);
      // increment offset
      setOffset(offset + batchSize);
      return courses;
    } catch (error) {
      setSearchLoading(false);
      setSearchError(error);
      // console.log(Error("FETCH_SEARCH_RESULTS_FAILURE: "+error))
      throw handleAPIError(error);
    }
  };

  const fetchCourse = async (id) => {
    try {
      const search_filter = { time: null, department: null, category: null, enroll_method: null, strict_match: false };
      const batchSize = 1;
      const offset = 0;
      const {
        data: { courses },
      } = await instance.post(`/courses/ids`, { ids: [id], filter: search_filter, batch_size: batchSize, offset: offset });
      const [course] = courses;
      return course;
    } catch (error) {
      throw handleAPIError(error);
    }
  };

  const getCourseEnrollInfo = async (token, course_id) => {
    try {
      const {
        data: { course_status },
      } = await instance.get(`/courses/${course_id}/enrollinfo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return course_status;
    } catch (error) {
      throw handleAPIError(error);
    }
  };

  const getNTURatingData = async (token, course_id) => {
    try {
      const {
        data: { course_rating },
      } = await instance.get(`/courses/${course_id}/rating`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return course_rating;
    } catch (error) {
      throw handleAPIError(error);
    }
  };

  const getPTTData = async (token, course_id, type) => {
    try {
      const {
        data: { course_rating },
      } = await instance.get(`/courses/${course_id}/ptt/${type}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return course_rating;
    } catch (error) {
      throw handleAPIError(error);
    }
  };

  const getCourseSyllabusData = async (course_id) => {
    try {
      const {
        data: { course_syllabus },
      } = await instance.get(`/courses/${course_id}/syllabus`);
      return course_syllabus;
    } catch (error) {
      throw handleAPIError(error);
    }
  };

  // used in SideCourseTableContainer initialization, to fetch all course objects by ids
  const fetchCourseTableCoursesByIds = async (ids_arr) => {
    try {
      const search_filter = { strict_match: false, time: null, department: null, category: null, enroll_method: null };
      const batchSize = 15000; // max batch size
      const offset = 0;
      const {
        data: { courses },
      } = await instance.post(`/courses/ids`, { ids: ids_arr, filter: search_filter, batch_size: batchSize, offset: offset });
      return courses;
    } catch (error) {
      throw handleAPIError(error);
    }
  };

  // used in userMyPage initialization, to fetch all favorite courses object by user's favorite courses ids
  const fetchFavoriteCourses = async (ids_arr) => {
    try {
      const search_filter = { strict_match: false, time: null, department: null, category: null, enroll_method: null };
      const batchSize = 15000;
      const offset = 0;
      const {
        data: { courses },
      } = await instance.post(`/courses/ids`, { ids: ids_arr, filter: search_filter, batch_size: batchSize, offset: offset });
      return courses;
    } catch (error) {
      throw handleAPIError(error);
    }
  };

  return (
    <CourseSearchingContext.Provider
      value={{
        searchIds,
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
        setBatchSize,
        setSearchSettings,
        setSearchColumns,
        setSearchFiltersEnable,
        setSearchFilters,
        fetchSearchIDs,
        fetchSearchResults,
        fetchCourse,
        getCourseEnrollInfo,
        getNTURatingData,
        getPTTData,
        getCourseSyllabusData,
        fetchCourseTableCoursesByIds,
        fetchFavoriteCourses,
      }}
      {...props}
    />
  );
}

function useCourseSearchingContext() {
  return useContext(CourseSearchingContext);
}

export { CourseSearchingProvider, useCourseSearchingContext };
