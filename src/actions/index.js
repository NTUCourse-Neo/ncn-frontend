import {
  SET_SEARCH_COLUMN,
  SET_SEARCH_SETTINGS,
  SET_FILTERS,
  SET_FILTERS_ENABLE,
  UPDATE_COURSE_TABLE,
  LOG_IN_SUCCESS,
  LOG_OUT_SUCCESS,
  SET_DISPLAY_TAGS,
} from "constants/action-types";
import instance from "api/axios";

// normal actions
const setSearchColumn = (col_name) => ({ type: SET_SEARCH_COLUMN, payload: col_name });
const setSearchSettings = (setting_obj) => ({ type: SET_SEARCH_SETTINGS, payload: setting_obj });
const setFilterEnable = (filter_name, enable) => ({ type: SET_FILTERS_ENABLE, filter_name: filter_name, payload: enable });
const updateCourseTable = (course_table) => ({ type: UPDATE_COURSE_TABLE, payload: course_table });
const logOut = () => ({ type: LOG_OUT_SUCCESS });
const logIn = (user_data) => ({ type: LOG_IN_SUCCESS, payload: user_data });
const setNewDisplayTags = (new_display_tags) => ({ type: SET_DISPLAY_TAGS, payload: new_display_tags });

// data =
// when filter_name == 'department', arr of dept_code (4-digits),
// when filter_name == 'time', 2D array, each subarray have length == 15
// when filter_name == 'category', arr of string (type of courses),
// when filter_name == 'enroll_method', arr of string (type of enroll method)
const setFilter = (filter_name, data) => ({ type: SET_FILTERS, filter_name: filter_name, payload: data });

const verify_recaptcha = (captcha_token) => async (dispatch) => {
  const resp = await instance.post(`/recaptcha`, { captcha_token: captcha_token });
  return resp.data;
};

// add try catch block to handle timeout.
const send_logs = (type, obj) => async (dispatch) => {
  if (process.env.REACT_APP_ENV === "prod") {
    const resp = await instance.post(`/logs/${type}`, obj);
    return resp.data;
  } else {
    console.log("[INFO] Logs are not sent to server in development mode.");
  }
};

export {
  setSearchColumn,
  setSearchSettings,
  logOut,
  logIn,
  updateCourseTable,
  verify_recaptcha,
  setNewDisplayTags,
  send_logs,
  setFilter,
  setFilterEnable,
};
