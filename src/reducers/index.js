// store initial states and reducers
import {
  FETCH_SEARCH_RESULTS_FAILURE,
  FETCH_SEARCH_RESULTS_SUCCESS,
  FETCH_SEARCH_RESULTS_REQUEST,
  FETCH_SEARCH_IDS_FAILURE,
  FETCH_SEARCH_IDS_REQUEST,
  FETCH_SEARCH_IDS_SUCCESS,
  SET_BATCH_SIZE,
  SET_SEARCH_COLUMN,
  SET_SEARCH_SETTINGS,
  SET_FILTERS,
  INCREMENT_OFFSET,
  UPDATE_TOTAL_COUNT,
  SET_FILTERS_ENABLE,
  UPDATE_COURSE_TABLE,
  LOG_IN_SUCCESS,
  LOG_OUT_SUCCESS,
  UPDATE_USER,
  SET_DISPLAY_TAGS,
  SET_HOVER_COURSE,
} from "constants/action-types";
import { parseCourseTime } from "utils/parseCourseTime";

const initState = {
  search_ids: [], // array of course_id
  search_results: [], // array of course objects
  search_loading: false, // boolean
  search_error: null, // null(no error) or error_message
  total_count: 0, // total number of results
  batch_size: 20,
  offset: 0,
  display_tags: [],
  search_columns: ["course_name", "teacher"], // array of column names, default is all columns
  search_settings: { show_selected_courses: false, only_show_not_conflicted_courses: false, sync_add_to_nol: false, strict_search_mode: false }, // object of settings
  search_filters_enable: { time: false, department: false, category: false, enroll_method: false }, // object of boolean, enable/disable filters
  search_filters: { time: [[], [], [], [], [], [], []], department: [], category: [], enroll_method: ["1", "2", "3"] }, // default value of filters
  course_table: null, // only one course table for now
  user: null, // userInfo include {db, auth0} // deprecated, moved to UserProvider
  hoveredCourse: null, // course object
  hoveredCourseTime: null, // course time object
};

const reducer = (state = initState, action) => {
  // console.log("Redux action: ", action.type);
  switch (action.type) {
    case FETCH_SEARCH_IDS_REQUEST:
      return { ...state, search_loading: true };
    case FETCH_SEARCH_IDS_SUCCESS:
      return { ...state, search_ids: action.payload, search_loading: false, search_error: null, offset: 0, search_results: [], total_count: 0 };
    case FETCH_SEARCH_IDS_FAILURE:
      return { ...state, search_loading: false, search_error: action.payload };
    case FETCH_SEARCH_RESULTS_REQUEST:
      return { ...state, search_loading: true };
    case FETCH_SEARCH_RESULTS_SUCCESS:
      return { ...state, search_results: [...state.search_results, ...action.payload], search_loading: false, search_error: null };
    case FETCH_SEARCH_RESULTS_FAILURE:
      return { ...state, search_loading: false, search_error: action.payload };
    case SET_BATCH_SIZE:
      return { ...state, batch_size: action.payload };
    case INCREMENT_OFFSET:
      return { ...state, offset: state.offset + state.batch_size };
    case UPDATE_TOTAL_COUNT:
      return { ...state, total_count: action.payload };
    case SET_SEARCH_COLUMN: {
      const col_name = action.payload;
      if (state.search_columns.includes(col_name)) {
        // remove column_name from columns
        return { ...state, search_columns: state.search_columns.filter((col) => col !== col_name) };
      } else {
        // add column_name to columns
        return { ...state, search_columns: [...state.search_columns, col_name] };
      }
    }
    case SET_SEARCH_SETTINGS:
      return { ...state, search_settings: action.payload };
    case SET_FILTERS_ENABLE:
      if (action.filter_name === "time") {
        return { ...state, search_filters_enable: { ...state.search_filters_enable, time: action.payload } };
      } else if (action.filter_name === "department") {
        return { ...state, search_filters_enable: { ...state.search_filters_enable, department: action.payload } };
      } else if (action.filter_name === "category") {
        return { ...state, search_filters_enable: { ...state.search_filters_enable, category: action.payload } };
      } else if (action.filter_name === "enroll_method") {
        return { ...state, search_filters_enable: { ...state.search_filters_enable, enroll_method: action.payload } };
      } else {
        // default
        return state;
      }
    case SET_FILTERS: {
      const data = action.payload;
      const filter_name = action.filter_name;
      if (filter_name === "department") {
        return { ...state, search_filters: { ...state.search_filters, department: data } };
      } else if (filter_name === "time") {
        return { ...state, search_filters: { ...state.search_filters, time: data } };
      } else if (filter_name === "category") {
        return { ...state, search_filters: { ...state.search_filters, category: data } };
      } else if (filter_name === "enroll_method") {
        return { ...state, search_filters: { ...state.search_filters, enroll_method: data } };
      } else {
        return { ...state };
      }
    }
    case UPDATE_COURSE_TABLE:
      return { ...state, course_table: action.payload };
    case LOG_IN_SUCCESS:
      return { ...state, user: action.payload };
    case LOG_OUT_SUCCESS:
      return { ...state, user: null };
    case UPDATE_USER:
      return { ...state, user: action.payload };
    case SET_DISPLAY_TAGS:
      return { ...state, display_tags: action.payload };
    case SET_HOVER_COURSE: {
      if (action.payload === null) {
        return { ...state, hoveredCourse: null, hoveredCourseTime: null };
      }
      const course = action.payload;
      const hoverCourseTime = parseCourseTime(course, {});
      return { ...state, hoveredCourse: course, hoveredCourseTime: hoverCourseTime };
    }
    default:
      return state;
  }
};

export default reducer;
