import {
  SET_SEARCH_COLUMN,
  SET_SEARCH_SETTINGS,
  SET_BATCH_SIZE,
  SET_FILTERS,
  SET_FILTERS_ENABLE,
  UPDATE_COURSE_TABLE,
  SET_DISPLAY_TAGS,
  SET_HOVER_COURSE,
} from "constants/action-types";

// normal actions
const setSearchColumn = (col_name) => ({ type: SET_SEARCH_COLUMN, payload: col_name });
const setSearchSettings = (setting_obj) => ({ type: SET_SEARCH_SETTINGS, payload: setting_obj });
const setFilterEnable = (filter_name, enable) => ({ type: SET_FILTERS_ENABLE, filter_name: filter_name, payload: enable });
const updateCourseTable = (course_table) => ({ type: UPDATE_COURSE_TABLE, payload: course_table });
const setNewDisplayTags = (new_display_tags) => ({ type: SET_DISPLAY_TAGS, payload: new_display_tags });
const setBatchSize = (new_batch_size) => ({ type: SET_BATCH_SIZE, payload: new_batch_size });
const setHoveredCourse = (course) => ({ type: SET_HOVER_COURSE, payload: course });

// data =
// when filter_name == 'department', arr of dept_code (4-digits),
// when filter_name == 'time', 2D array, each subarray have length == 15
// when filter_name == 'category', arr of string (type of courses),
// when filter_name == 'enroll_method', arr of string (type of enroll method)
const setFilter = (filter_name, data) => ({ type: SET_FILTERS, filter_name: filter_name, payload: data });

export { setSearchColumn, setSearchSettings, updateCourseTable, setNewDisplayTags, setFilter, setFilterEnable, setBatchSize, setHoveredCourse };
