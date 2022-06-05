import { UPDATE_USER, LOG_OUT_SUCCESS } from "constants/action-types";
import instance from "api/axios";

const linkCoursetableToUser = (token, course_table_id, user_id) => async (dispatch) => {
  try {
    const {
      data: { user },
    } = await instance.post(
      `/users/${user_id}/course_table`,
      { course_table_id: course_table_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch({ type: UPDATE_USER, payload: user });
  } catch (error) {
    // console.log(Error("Error in linkCoursetableToUser: "+error))

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

const fetchUserById = (token, user_id) => async (dispatch) => {
  try {
    const {
      data: { user },
    } = await instance.get(`/users/${user_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // user contains user in db & auth0, either null (not found) or an object.
    return user;
  } catch (error) {
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

const registerNewUser = (token, email) => async (dispatch) => {
  try {
    const {
      data: { user },
    } = await instance.post(
      `/users/`,
      { user: { email: email } },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // either null (not found) or an object.
    return user;
  } catch (error) {
    // console.log(Error("Error in registerNewUser: "+error))

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

const addFavoriteCourse = (token, new_favorite_list) => async (dispatch) => {
  try {
    const {
      data: { user },
    } = await instance.patch(
      `/users/`,
      { user: { favorites: new_favorite_list } },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch({ type: UPDATE_USER, payload: user });
  } catch (error) {
    // console.log(Error("Error in addFavoriteCourse: "+error))

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

const patchUserInfo = (token, updateObject) => async (dispatch) => {
  try {
    const {
      data: { user },
    } = await instance.patch(
      `/users/`,
      { user: updateObject },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch({ type: UPDATE_USER, payload: user });
  } catch (error) {
    // console.log(Error("Error in patchUserInfo: "+error))

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

const deleteUserProfile = (token) => async (dispatch) => {
  try {
    await instance.delete(`/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    // console.log(Error("Error in deleteUserProfile: "+error))

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

const deleteUserAccount = (token) => async (dispatch) => {
  try {
    await instance.delete(`/users/account`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({ type: LOG_OUT_SUCCESS });
  } catch (error) {
    // console.log(Error("Error in deleteUserAccount: "+error))

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

const request_otp_code = (token, student_id) => async (dispatch) => {
  const resp = await instance.post(
    `/users/student_id/link`,
    { student_id: student_id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return resp.data;
};

const use_otp_link_student_id = (token, student_id, otp_code) => async (dispatch) => {
  const resp = await instance.post(
    `/users/student_id/link`,
    { student_id: student_id, otp_code: otp_code },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return resp.data;
};

export {
  linkCoursetableToUser,
  fetchUserById,
  registerNewUser,
  addFavoriteCourse,
  patchUserInfo,
  deleteUserProfile,
  deleteUserAccount,
  request_otp_code,
  use_otp_link_student_id,
};
