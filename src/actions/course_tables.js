import { UPDATE_COURSE_TABLE } from "constants/action-types";
import instance from "queries/axiosInstance";
import handleAPIError from "utils/handleAPIError";

const createCourseTable = (course_table_id, course_table_name, user_id, semester) => async (dispatch) => {
  try {
    const {
      data: { course_table },
    } = await instance.post(`/course_tables/`, { id: course_table_id, name: course_table_name, user_id: user_id, semester: semester });
    dispatch({ type: UPDATE_COURSE_TABLE, payload: course_table });
    return course_table;
  } catch (error) {
    throw handleAPIError(error);
  }
};

const fetchCourseTable = (course_table_id) => async (dispatch) => {
  try {
    const {
      data: { course_table },
    } = await instance.get(`/course_tables/${course_table_id}`);
    dispatch({ type: UPDATE_COURSE_TABLE, payload: course_table });
    return course_table;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 403 || error.response.status === 404) {
        // expired course_table
        // if fetch expired course_table, return null and handle it by frontend logic
        dispatch({ type: UPDATE_COURSE_TABLE, payload: null });
        return null;
      }
    } else {
      throw handleAPIError(error);
    }
  }
};

const patchCourseTable = (course_table_id, course_table_name, user_id, expire_ts, courses) => async (dispatch) => {
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
    dispatch({ type: UPDATE_COURSE_TABLE, payload: course_table });
    return course_table;
  } catch (error) {
    // need to let frontend handle error, so change to return null
    if (error.response) {
      if (error.response.status === 403 && error.response.data.message === "Course table is expired") {
        // expired course_table
        // if fetch expired course_table, return null and handle it by frontend logic
        dispatch({ type: UPDATE_COURSE_TABLE, payload: null });
        return null;
      }
    } else {
      throw handleAPIError(error);
    }
  }
};

export { createCourseTable, fetchCourseTable, patchCourseTable };
