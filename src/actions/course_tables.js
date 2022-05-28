import { UPDATE_COURSE_TABLE } from "constants/action-types";
import instance from "api/axios";

const createCourseTable = (course_table_id, course_table_name, user_id, semester) => async (dispatch) => {
  try {
    const {
      data: { course_table },
    } = await instance.post(`/course_tables/`, { id: course_table_id, name: course_table_name, user_id: user_id, semester: semester });
    dispatch({ type: UPDATE_COURSE_TABLE, payload: course_table });
    return course_table;
  } catch (error) {
    // console.log(Error("Error in createCourseTable: "+error));

    if (error.response) {
      // server did response, used for handle custom error msg
      const error_obj = {
        status_code: error.response.status,
        backend_msg: error.response.data.message,
        error_info: error.message,
        error_detail: Error(error).stack,
      };
      throw error_obj;
    } else if (error.request) {
      // The request was made but no response was received (server is downed)
      const status = 521; // Server is down
      const error_obj = {
        status_code: status,
        backend_msg: "no",
        error_info: error.message,
        error_detail: Error(error).stack,
      };
      throw error_obj;
    } else {
      // Something happened in setting up the request that triggered an Error
      const status = 400; // Bad request
      const error_obj = {
        status_code: status,
        backend_msg: "no",
        error_info: error.message,
        error_detail: Error(error).stack,
      };
      throw error_obj;
    }
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
    // console.log(Error("Error in fetchCourseTable: "+error));

    if (error.response) {
      if (error.response.status === 403 || error.response.status === 404) {
        // expired course_table
        // if fetch expired course_table, return null and handle it by frontend logic
        dispatch({ type: UPDATE_COURSE_TABLE, payload: null });
        return null;
      }
    } else {
      if (error.response) {
        // server did response, used for handle custom error msg
        const error_obj = {
          status_code: error.response.status,
          backend_msg: error.response.data.message,
          error_info: error.message,
          error_detail: Error(error).stack,
        };
        throw error_obj;
      } else if (error.request) {
        // The request was made but no response was received (server is downed)
        const status = 521; // Server is down
        const error_obj = {
          status_code: status,
          backend_msg: "no",
          error_info: error.message,
          error_detail: Error(error).stack,
        };
        throw error_obj;
      } else {
        // Something happened in setting up the request that triggered an Error
        const status = 400; // Bad request
        const error_obj = {
          status_code: status,
          backend_msg: "no",
          error_info: error.message,
          error_detail: Error(error).stack,
        };
        throw error_obj;
      }
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
    // console.log(Error("Error in patchCourseTable: "+error));

    // need to let frontend handle error, so change to return null
    if (error.response) {
      if (error.response.status === 403 && error.response.data.message === "Course table is expired") {
        // expired course_table
        // if fetch expired course_table, return null and handle it by frontend logic
        dispatch({ type: UPDATE_COURSE_TABLE, payload: null });
        return null;
      }
    } else {
      if (error.response) {
        // server did response, used for handle custom error msg
        const error_obj = {
          status_code: error.response.status,
          backend_msg: error.response.data.message,
          error_info: error.message,
          error_detail: Error(error).stack,
        };
        throw error_obj;
      } else if (error.request) {
        // The request was made but no response was received (server is downed)
        const status = 521; // Server is down
        const error_obj = {
          status_code: status,
          backend_msg: "no",
          error_info: error.message,
          error_detail: Error(error).stack,
        };
        throw error_obj;
      } else {
        // Something happened in setting up the request that triggered an Error
        const status = 400; // Bad request
        const error_obj = {
          status_code: status,
          backend_msg: "no",
          error_info: error.message,
          error_detail: Error(error).stack,
        };
        throw error_obj;
      }
    }
  }
};

export { createCourseTable, fetchCourseTable, patchCourseTable };
