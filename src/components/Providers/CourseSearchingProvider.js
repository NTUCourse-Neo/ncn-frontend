import React, { createContext, useContext, useState } from "react";
import instance from "queries/axiosInstance";
import handleAPIError from "utils/handleAPIError";
import { parseCourseTime } from "utils/parseCourseTime";

const CourseSearchingContext = createContext({
  search_ids: [],
  search_results: [],
  search_loading: false,
  search_error: null,
  total_count: 0, // total number of results
  batch_size: 20,
  offset: 0,
  display_tags: [],
  search_columns: ["course_name", "teacher"], // array of column names, default is all columns
  search_settings: { show_selected_courses: false, only_show_not_conflicted_courses: false, sync_add_to_nol: false, strict_search_mode: false }, // object of settings
  search_filters_enable: { time: false, department: false, category: false, enroll_method: false }, // object of boolean, enable/disable filters
  search_filters: { time: [[], [], [], [], [], [], []], department: [], category: [], enroll_method: ["1", "2", "3"] }, // default value of filters
  course_table: null, // only one course table for now
  hoveredCourse: null, // course object
  hoveredCourseTimeMap: null, // course time object
  setBatchSize: () => {},
  setSearchSettings: () => {},
  setSearchColumn: () => {},
  setFilterEnable: () => {},
  setNewDisplayTags: () => {},
  setHoveredCourseData: () => {},
  setFilter: () => {},
  createCourseTable: () => {},
  fetchCourseTable: () => {},
  patchCourseTable: () => {},
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
  const [search_ids, setSearchIds] = useState([]);
  const [search_results, setSearchResult] = useState([]);
  const [search_loading, setSearchLoading] = useState(false);
  const [search_error, setSearchError] = useState(null);
  const [total_count, setTotalCount] = useState(0);
  const [batch_size, setBatchSize] = useState(20);
  const [offset, setOffset] = useState(0);
  const [display_tags, setDisplayTags] = useState([]);
  const [search_columns, setSearchColumns] = useState(["course_name", "teacher"]);
  const [search_settings, setSearchSettings] = useState({
    show_selected_courses: false,
    only_show_not_conflicted_courses: false,
    sync_add_to_nol: false,
    strict_search_mode: false,
  });
  const [search_filters_enable, setSearchFiltersEnable] = useState({ time: false, department: false, category: false, enroll_method: false });
  const [search_filters, setSearchFilters] = useState({
    time: [[], [], [], [], [], [], []],
    department: [],
    category: [],
    enroll_method: ["1", "2", "3"],
  });
  const [course_table, setCourseTable] = useState(null);
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [hoveredCourseTimeMap, setHoveredCourseTimeMap] = useState(null);

  const setSearchColumn = (col_name) => {
    if (search_columns.includes(col_name)) {
      // remove column_name from columns
      setSearchColumns(search_columns.filter((col) => col !== col_name));
    } else {
      // add column_name to columns
      setSearchColumns([...search_columns, col_name]);
    }
  };
  const setFilterEnable = (filter_name, enable) => {
    setSearchFiltersEnable({ ...search_filters_enable, [filter_name]: enable });
  };
  const setNewDisplayTags = (new_display_tags) => {
    setDisplayTags(new_display_tags);
  };
  const setHoveredCourseData = (course) => {
    if (course === null) {
      setHoveredCourse(null);
      setHoveredCourseTimeMap(null);
    } else {
      const hoverCourseTime = parseCourseTime(course, {});
      setHoveredCourse(course);
      setHoveredCourseTimeMap(hoverCourseTime);
    }
  };
  const setFilter = (filter_name, data) => {
    setSearchFilters({ ...search_filters, [filter_name]: data });
  };

  const createCourseTable = async (course_table_id, course_table_name, user_id, semester) => {
    try {
      const {
        data: { course_table },
      } = await instance.post(`/course_tables/`, { id: course_table_id, name: course_table_name, user_id: user_id, semester: semester });
      setCourseTable(course_table);
      return course_table;
    } catch (error) {
      throw handleAPIError(error);
    }
  };

  const fetchCourseTable = async (course_table_id) => {
    try {
      const {
        data: { course_table },
      } = await instance.get(`/course_tables/${course_table_id}`);
      setCourseTable(course_table);
      return course_table;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403 || error.response.status === 404) {
          // expired course_table
          // if fetch expired course_table, return null and handle it by frontend logic
          setCourseTable(course_table);
          return null;
        }
      } else {
        throw handleAPIError(error);
      }
    }
  };

  const patchCourseTable = async (course_table_id, course_table_name, user_id, expire_ts, courses) => {
    // filter out "" in courses
    const new_courses = courses.filter((course) => course !== "");
    try {
      const {
        data: { course_table },
      } = await instance.patch(`/course_tables/${course_table_id}`, {
        name: course_table_name,
        user_id: user_id,
        expire_ts: expire_ts,
        courses: new_courses,
      });
      setCourseTable(course_table);
      return course_table;
    } catch (error) {
      // need to let frontend handle error, so change to return null
      if (error.response) {
        if (error.response.status === 403 && error.response.data.message === "Course table is expired") {
          // expired course_table
          // if fetch expired course_table, return null and handle it by frontend logic
          setCourseTable(course_table);
          return null;
        }
      } else {
        throw handleAPIError(error);
      }
    }
  };

  const fetchSearchIDs = async (searchString, paths, filters_enable, filter_obj, batch_size, strict_match_bool) => {
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
        } = await instance.post(`/courses/ids`, { ids: ids, filter: search_filter, batch_size: batch_size, offset: 0 });
        setSearchResult(courses);
        setSearchLoading(false);
        setSearchError(null);
        // increment offset
        setOffset(batch_size);
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

  const fetchSearchResults = async (ids_arr, filters_enable, filter_obj, batch_size, offset, strict_match_bool) => {
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
      } = await instance.post(`/courses/ids`, { ids: ids_arr, filter: search_filter, batch_size: batch_size, offset: offset });
      // console.log(courses); // checking receive array of courses
      setSearchResult([...search_results, ...courses]);
      setSearchLoading(false);
      setSearchError(null);
      // increment offset
      setOffset(offset + batch_size);
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
      const batch_size = 1;
      const offset = 0;
      const {
        data: { courses },
      } = await instance.post(`/courses/ids`, { ids: [id], filter: search_filter, batch_size: batch_size, offset: offset });
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
      const batch_size = 15000; // max batch size
      const offset = 0;
      const {
        data: { courses },
      } = await instance.post(`/courses/ids`, { ids: ids_arr, filter: search_filter, batch_size: batch_size, offset: offset });
      return courses;
    } catch (error) {
      throw handleAPIError(error);
    }
  };

  // used in userMyPage initialization, to fetch all favorite courses object by user's favorite courses ids
  const fetchFavoriteCourses = async (ids_arr) => {
    try {
      const search_filter = { strict_match: false, time: null, department: null, category: null, enroll_method: null };
      const batch_size = 15000;
      const offset = 0;
      const {
        data: { courses },
      } = await instance.post(`/courses/ids`, { ids: ids_arr, filter: search_filter, batch_size: batch_size, offset: offset });
      return courses;
    } catch (error) {
      throw handleAPIError(error);
    }
  };

  return (
    <CourseSearchingContext.Provider
      value={{
        search_ids,
        search_results,
        search_loading,
        search_error,
        total_count,
        batch_size,
        offset,
        display_tags,
        search_columns,
        search_settings,
        search_filters_enable,
        search_filters,
        course_table,
        hoveredCourse,
        hoveredCourseTimeMap,
        setBatchSize,
        setSearchSettings,
        setCourseTable,
        setSearchColumn,
        setFilterEnable,
        setNewDisplayTags,
        setHoveredCourseData,
        setFilter,
        createCourseTable,
        fetchCourseTable,
        patchCourseTable,
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
