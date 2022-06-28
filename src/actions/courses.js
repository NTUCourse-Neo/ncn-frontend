import {
  FETCH_SEARCH_RESULTS_FAILURE,
  FETCH_SEARCH_RESULTS_SUCCESS,
  FETCH_SEARCH_RESULTS_REQUEST,
  FETCH_SEARCH_IDS_FAILURE,
  FETCH_SEARCH_IDS_REQUEST,
  FETCH_SEARCH_IDS_SUCCESS,
  INCREMENT_OFFSET,
  UPDATE_TOTAL_COUNT,
} from "constants/action-types";
import instance from "api/axios";
import handleAPIError from "utils/handleAPIError";

const fetchSearchIDs = (searchString, paths, filters_enable, filter_obj, batch_size, strict_match_bool) => async (dispatch) => {
  dispatch({ type: FETCH_SEARCH_IDS_REQUEST });

  try {
    const {
      data: { ids },
    } = await instance.post(`/courses/search`, { query: searchString, paths: paths });
    // console.log(ids); // checking receive array of courses
    dispatch({ type: FETCH_SEARCH_IDS_SUCCESS, payload: ids });

    // fetch batch 0 first
    dispatch({ type: FETCH_SEARCH_RESULTS_REQUEST });
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
      dispatch({ type: FETCH_SEARCH_RESULTS_SUCCESS, payload: courses });
      // increment offset
      dispatch({ type: INCREMENT_OFFSET });
      // update total_results count
      dispatch({ type: UPDATE_TOTAL_COUNT, payload: total_count });
    } catch (error) {
      dispatch({ type: FETCH_SEARCH_RESULTS_FAILURE, payload: error });
      // console.log(Error("FETCH_SEARCH_RESULTS_FAILURE: "+error));
      throw error;
    }

    return ids;
  } catch (error) {
    dispatch({ type: FETCH_SEARCH_IDS_FAILURE, payload: error });
    // console.log(Error("FETCH_SEARCH_IDS_FAILURE: "+error))
    throw handleAPIError(error);
  }
};

const fetchSearchResults = (ids_arr, filters_enable, filter_obj, batch_size, offset, strict_match_bool) => async (dispatch) => {
  dispatch({ type: FETCH_SEARCH_RESULTS_REQUEST });

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
    dispatch({ type: FETCH_SEARCH_RESULTS_SUCCESS, payload: courses });
    // increment offset
    dispatch({ type: INCREMENT_OFFSET });
    return courses;
  } catch (error) {
    dispatch({ type: FETCH_SEARCH_RESULTS_FAILURE, payload: error });
    // console.log(Error("FETCH_SEARCH_RESULTS_FAILURE: "+error))
    throw handleAPIError(error);
  }
};

const fetchCourse = (id) => async (dispatch) => {
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

const getCourseEnrollInfo = (token, course_id) => async (dispatch) => {
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

const getNTURatingData = (token, course_id) => async (dispatch) => {
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

const getPTTData = (token, course_id, type) => async (dispatch) => {
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

const getCourseSyllabusData = (course_id) => async (dispatch) => {
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
const fetchCourseTableCoursesByIds = (ids_arr) => async (dispatch) => {
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
const fetchFavoriteCourses = (ids_arr) => async (dispatch) => {
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

export {
  fetchSearchIDs,
  fetchSearchResults,
  fetchCourse,
  getCourseEnrollInfo,
  getNTURatingData,
  getPTTData,
  getCourseSyllabusData,
  fetchCourseTableCoursesByIds,
  fetchFavoriteCourses,
};
